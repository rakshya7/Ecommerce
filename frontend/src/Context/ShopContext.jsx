import React, { createContext, useEffect, useState } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let index = 0; index <= 300; index++) {
    cart[index] = 0;
  }
  return cart;
};

const ShopContextProvider = (props) => {
  const [all_product, setAll_Product] = useState([]);
  const [cartItems, setCartItems] = useState(getDefaultCart());
  // "loading" | "ready" | "error": lets pages tell "still loading" from "no products"
  const [productsStatus, setProductsStatus] = useState("loading");

  useEffect(() => {
    // Fetch all products once on mount
    fetch("http://localhost:4000/allproducts")
      .then((response) => response.json())
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("Unexpected products response");
        setAll_Product(data);
        setProductsStatus("ready");
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
        setProductsStatus("error");
      });

    // If logged in, fetch cart data from server
    const token = localStorage.getItem("auth-token");
    if (token) {
      fetch("http://localhost:4000/getcart", {
        method: "POST",
        headers: {
          Accept: "application/json", // corrected content type here
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({}), // empty JSON body instead of empty string
      })
        .then((response) => response.json())
        .then((data) => {
          if (data) setCartItems(data);
        })
        .catch((err) => console.error("Failed to fetch cart data:", err));
    }
  }, []);

  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));

    const token = localStorage.getItem("auth-token");
    if (token) {
      fetch("http://localhost:4000/addtocart", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({ itemId }),
      })
        .then((response) => response.json())
        .then((data) => console.log("Add to cart response:", data))
        .catch((err) => console.error("Failed to add to cart:", err));
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: Math.max(prev[itemId] - 1, 0) }));

    const token = localStorage.getItem("auth-token");
    if (token) {
      fetch("http://localhost:4000/removefromcart", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({ itemId }),
      })
        .then((response) => response.json())
        .then((data) => console.log("Remove from cart response:", data))
        .catch((err) => console.error("Failed to remove from cart:", err));
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = all_product.find((product) => product.id === Number(item));
        if (itemInfo) {
          totalAmount += itemInfo.new_price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };

  const contextValue = {
    getTotalCartItems,
    getTotalCartAmount,
    all_product,
    productsStatus,
    cartItems,
    addToCart,
    removeFromCart,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
