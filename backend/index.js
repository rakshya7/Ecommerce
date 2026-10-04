const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { log, error } = require("console");
const { type } = require("os");
const CryptoJS = require("crypto-js");

// Global error handlers for debugging crashes
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});

app.use(express.json());
app.use(cors());

// Database connection: the URI lives in .env at the project root (MONGO_URI=...), never in this file
process.loadEnvFile(path.join(__dirname, "..", ".env"));
mongoose.connect(process.env.MONGO_URI)

  .then(() => console.log("DB Connected"))
  .catch((err) => console.error("DB Connection Error:", err));

// Image Storage Engine
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage: storage });

// Creating upload endpoint for images
app.use("/images", express.static("upload/images"));
app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

// Schema for Creating Products
const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

// Schema for Orders
const Order = mongoose.model("Order", {
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  transactionUuid: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  products: { type: Array, required: true }, // Array of {id, quantity}
  status: { type: String, default: "completed" },
  date: { type: Date, default: Date.now },
});

// Schema creating for user model
const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// API creation
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// Add product
app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  console.log(product);
  await product.save();
  console.log("Saved");
  res.json({
    success: true,
    name: req.body.name,
  });
});

// Creating API for deletion
app.post("/removeproduct", async (req, res) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Removed");
  res.json({
    success: true,
    name: req.body.name,
  });
});

// Creating API for getting all products
app.get("/allproducts", async (req, res) => {
  let products = await Product.find({});
  console.log("All Products Fetched");
  res.send(products);
});

// Creating Endpoint for registering the user
app.post("/signup", async (req, res) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return res.status(400).json({
      success: false,
      errors: "existing user found with same email address",
    });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });
  await user.save();
  const data = {
    user: {
      id: user.id,
    },
  };
  const token = jwt.sign(data, "secret_ecom");
  res.json({ success: true, token });
});

// Creating endpoint for user login
app.post("/login", async (req, res) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };
      const token = jwt.sign(data, "secret_ecom");
      res.json({ success: true, token });
    } else {
      res.json({ success: false, errors: "Wrong Password" });
    }
  } else {
    res.json({ success: false, errors: "Wrong email id" });
  }
});

// Creating endpoint for newcollection data
app.get("/newcollections", async (req, res) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  console.log("new collection Fetched");
  res.send(newcollection);
});

// Creating endpoint for popular in women section
app.get("/popularinwomen", async (req, res) => {
  let products = await Product.find({ category: "women" });
  let popular_in_women = products.slice(0, 4);
  console.log("Popular in women fetched");
  res.send(popular_in_women);
});

// Creating middleware to fetch user
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ errors: "Please authenticate using valid token" });
  } else {
    try {
      const data = jwt.verify(token, "secret_ecom");
      req.user = data.user;
      next();
    } catch (error) {
      res
        .status(401)
        .send({ erros: "please authenticate using a valid token" });
    }
  }
};

// Creating endpoint for adding products in cartdata
app.post("/addtocart", fetchUser, async (req, res) => {
  console.log("added", req.body.itemId);
  let userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Added");
});

// Creating endpoint to remove product from cart data
app.post("/removefromcart", fetchUser, async (req, res) => {
  console.log("removed", req.body.itemId);
  let userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId] -= 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  res.send("Removed");
});

// Creating endpoint to save the cart data
app.post("/getcart", fetchUser, async (req, res) => {
  console.log("Get Cart");
  let userData = await Users.findOne({ _id: req.user.id });
  res.json(userData.cartData);
});

// eSewa Success Endpoint
app.get("/success", async (req, res) => {
  console.log("✅ eSewa Success Callback Received");
  console.log("Query Params:", req.query);

  const { data } = req.query;
  if (!data) {
    console.log("❌ No data param");
    return res.redirect("http://localhost:3000/failure");
  }

  try {
    const decodedData = Buffer.from(data, "base64").toString("utf-8");
    console.log("Decoded Data:", decodedData);
    const paymentData = JSON.parse(decodedData);

    const {
      transaction_code,
      status,
      total_amount,
      transaction_uuid,
      product_code,
      signed_field_names,
      signature,
    } = paymentData;

    console.log("Parsed:", { transaction_uuid, status });

    const secretKey = "8gBm/:&EnhH.1/q";
    const expectedProductCode = "EPAYTEST";

    const fields = signed_field_names.split(",");
    const message = fields
      .map((field) => `${field}=${paymentData[field]}`)
      .join(",");
    const expectedSignature = CryptoJS.HmacSHA256(message, secretKey);
    const expectedSignatureBase64 =
      CryptoJS.enc.Base64.stringify(expectedSignature);

    if (
      signature === expectedSignatureBase64 &&
      status === "COMPLETE" &&
      product_code === expectedProductCode
    ) {
      console.log("✅ Verified");

      // Extract userId from transaction_uuid: ORDER_userId_timestamp
      const parts = transaction_uuid ? transaction_uuid.split("_") : [];
      const userId = parts[1];
      console.log("User ID:", userId);

      if (!mongoose.Types.ObjectId.isValid(userId)) {
        console.log("❌ Invalid User ID format");
        return res.redirect("http://localhost:3000/failure");
      }

      const userData = await Users.findById(userId);
      if (!userData) {
        console.log("❌ User not found in database");
        return res.redirect("http://localhost:3000/failure");
      }

      // ✅ Create new order
      const order = new Order({
        userId: userData._id,
        transactionUuid: transaction_uuid,
        totalAmount: parseFloat(total_amount),
        products: Object.keys(userData.cartData)
          .filter((id) => userData.cartData[id] > 0)
          .map((id) => ({
            id: parseInt(id),
            quantity: userData.cartData[id],
          })),
      });

      await order.save();
      console.log("✅ Order saved");

      // ✅ Clear cart
      const emptyCart = {};
      for (let i = 0; i < 300; i++) emptyCart[i] = 0;
      await Users.findByIdAndUpdate(userId, { cartData: emptyCart });
      console.log("✅ Cart cleared");

      return res.redirect(
        `http://localhost:3000/success?transaction_uuid=${transaction_uuid}`
      );
    } else {
      console.log("❌ Verification failed");
      res.redirect("http://localhost:3000/failure");
    }
  } catch (err) {
    console.error("❌ Error in /success:", err);
    res.redirect("http://localhost:3000/failure");
  }
});

// eSewa Failure Endpoint
app.get("/failure", (req, res) => {
  console.log("Payment failed or cancelled");
  res.redirect("http://localhost:3000/failure");
});

// Creating endpoint for getting order details (for frontend)
app.get("/getorder", fetchUser, async (req, res) => {
  const { transactionUuid } = req.query;
  try {
    const order = await Order.findOne({ transactionUuid, userId: req.user.id });
    if (order) {
      res.json({ success: true, order });
    } else {
      res.json({ success: false, message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.listen(port, (req, res) => {
  console.log("server running on port 4000");
});
