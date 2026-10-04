import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import CryptoJS from "crypto-js";
import Icon from "../Icon/Icon";
import EmptyState, { LoadError } from "../EmptyState/EmptyState";
import { CATEGORIES, formatPrice } from "../../catalog";

const CartItems = () => {
  const { getTotalCartAmount, all_product, productsStatus, cartItems, addToCart, removeFromCart } =
    useContext(ShopContext);
  const [loginNeeded, setLoginNeeded] = useState(false);

  const handleEsewaPayment = () => {
    const totalAmount = getTotalCartAmount().toString();
    console.log("Initiating eSewa payment for amount:", totalAmount);

    const successUrl = "http://localhost:4000/success";
    const failureUrl = "http://localhost:4000/failure";

    // Get userId from localStorage (token decoded or stored earlier)
    const token = localStorage.getItem("auth-token");
    if (!token) {
      setLoginNeeded(true);
      return;
    }

    // Extract userId from JWT token
    const tokenPayload = JSON.parse(atob(token.split(".")[1]));
    const userId = tokenPayload.user.id;

    // Generate unique transaction UUID with userId
    const transaction_uuid = `ORDER_${userId}_${Date.now()}`;
    console.log("Transaction UUID:", transaction_uuid);

    const secretKey = "8gBm/:&EnhH.1/q";
    const product_code = "EPAYTEST";

    // Signature creation
    const message = `total_amount=${totalAmount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const signature = CryptoJS.HmacSHA256(message, secretKey);
    const signatureBase64 = CryptoJS.enc.Base64.stringify(signature);

    // Prepare the form
    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

    const params = {
      amount: totalAmount,
      tax_amount: "0",
      total_amount: totalAmount,
      product_service_charge: "0",
      product_delivery_charge: "0",
      transaction_uuid,
      product_code,
      success_url: successUrl,
      failure_url: failureUrl,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature: signatureBase64,
    };

    for (const key in params) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = params[key];
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
  };

  if (productsStatus === "loading") {
    return (
      <div className="container cartitems" aria-busy="true" aria-label="Loading cart">
        <div className="skeleton cartitems-skeleton" />
        <div className="skeleton cartitems-skeleton" />
      </div>
    );
  }
  if (productsStatus === "error") return <LoadError />;

  const lines = all_product.filter((e) => cartItems[e.id] > 0);

  if (lines.length === 0) {
    return (
      <EmptyState title="Your cart is empty" text="Pairs you add will show up here.">
        {CATEGORIES.map((category) => (
          <Link key={category.key} to={category.path} className="btn btn--secondary">
            Shop {category.label.toLowerCase()}
          </Link>
        ))}
      </EmptyState>
    );
  }

  return (
    <div className="container cartitems">
      <h1 className="page-title display">Cart</h1>

      <div className="cartitems-layout">
        <ul className="cartitems-lines">
          {lines.map((e) => {
            const quantity = cartItems[e.id];
            return (
              <li key={e.id} className="cartitems-line">
                <Link to={`/product/${e.id}`} className="cartitems-thumb" tabIndex={-1} aria-hidden="true">
                  <img src={e.image} alt="" />
                </Link>
                <div className="cartitems-details">
                  <Link to={`/product/${e.id}`} className="cartitems-name">
                    {e.name}
                  </Link>
                  <p className="cartitems-unit">{formatPrice(e.new_price)} each</p>
                </div>
                {/* quantity follows the cart API: one step up or down per request */}
                <div className="stepper">
                  <button
                    type="button"
                    onClick={() => removeFromCart(e.id)}
                    aria-label={quantity === 1 ? `Remove ${e.name} from cart` : `Decrease quantity of ${e.name}`}
                  >
                    <Icon name="minus" size={18} />
                  </button>
                  <span className="stepper-value" aria-label={`Quantity ${quantity}`}>
                    {quantity}
                  </span>
                  <button type="button" onClick={() => addToCart(e.id)} aria-label={`Increase quantity of ${e.name}`}>
                    <Icon name="plus" size={18} />
                  </button>
                </div>
                <p className="cartitems-line-total">{formatPrice(e.new_price * quantity)}</p>
              </li>
            );
          })}
        </ul>

        <section className="cartitems-summary" aria-labelledby="summary-title">
          <h2 id="summary-title" className="cartitems-summary-title">
            Order summary
          </h2>
          <dl className="cartitems-totals">
            <div>
              <dt>Subtotal</dt>
              <dd>{formatPrice(getTotalCartAmount())}</dd>
            </div>
            <div>
              <dt>Shipping</dt>
              <dd>Free</dd>
            </div>
            <div className="cartitems-grand-total">
              <dt>Total</dt>
              <dd>{formatPrice(getTotalCartAmount())}</dd>
            </div>
          </dl>

          {loginNeeded && (
            <p className="notice" role="alert">
              <Icon name="alert" />
              <span>
                Log in to pay for your order. <Link to="/login">Log in</Link>
              </span>
            </p>
          )}

          <button type="button" className="btn btn--primary btn--block" onClick={handleEsewaPayment}>
            Pay with eSewa
          </button>
          <p className="hint">You’ll complete the payment on eSewa.</p>
        </section>
      </div>
    </div>
  );
};

export default CartItems;
