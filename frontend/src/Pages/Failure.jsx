import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Icon from "../Components/Icon/Icon";
import "./CSS/OrderStatus.css";

const FailurePage = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const reason = queryParams.get("reason");
  const transactionUuid = queryParams.get("transaction_uuid");

  useEffect(() => {
    const logFailure = async () => {
      if (transactionUuid) {
        setLoading(true);
        try {
          await fetch("http://localhost:4000/logfailure", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ transactionUuid, reason }),
          });
        } catch (error) {
          console.error("Failed to log failure:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    logFailure();
  }, [transactionUuid, reason]);

  const getMessage = () => {
    if (!reason) {
      return transactionUuid
        ? "Your payment could not be processed. Please check your details and try again."
        : "Something went wrong with your payment. If this keeps happening, contact support.";
    }
    switch (reason) {
      case "payment_cancelled":
        return "Your payment was cancelled. You can try again or continue shopping.";
      case "payment_failed":
        return "The payment didn’t go through. Please check your payment method and try again.";
      case "server_error":
        return "A server error occurred. Please try again later or contact support.";
      default:
        return "Something went wrong with your payment. Please try again.";
    }
  };

  if (loading) {
    return (
      <div className="order-status order-status--loading" role="status">
        <div className="spinner" />
        <p>Processing your request…</p>
      </div>
    );
  }

  return (
    <div className="order-status">
      <span className="order-status-icon order-status-icon--error">
        <Icon name="alert" size={28} />
      </span>
      <h1 className="page-title display">Payment not completed</h1>
      <p className="order-status-text">{getMessage()}</p>
      <p className="order-status-text">
        Your items are still in your cart, so you can try again whenever you’re ready.
      </p>

      {transactionUuid && (
        <dl className="order-status-details">
          <div>
            <dt>Transaction ID</dt>
            <dd>{transactionUuid}</dd>
          </div>
        </dl>
      )}

      <div className="order-status-actions">
        <Link to="/cart" className="btn btn--primary">
          Back to cart
        </Link>
        <Link to="/" className="btn btn--secondary">
          Continue shopping
        </Link>
      </div>

      <p className="hint">
        Need help with your order?{" "}
        <a href="mailto:support@stepstyle.com" className="link">
          Contact support
        </a>
      </p>
    </div>
  );
};

export default FailurePage;
