import React, { useEffect, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import EmptyState from "../Components/EmptyState/EmptyState";
import Icon from "../Components/Icon/Icon";
import { formatPrice } from "../catalog";
import "./CSS/OrderStatus.css";

const SuccessPage = () => {
  const location = useLocation();
  const { clearCart } = useContext(ShopContext);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const queryParams = new URLSearchParams(location.search);
  const transactionUuid = queryParams.get("transaction_uuid");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!transactionUuid) {
        setError("This link doesn’t include an order reference.");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem("auth-token");
        const response = await fetch(
          `http://localhost:4000/getorder?transactionUuid=${transactionUuid}`,
          {
            headers: { "auth-token": token },
          }
        );
        const data = await response.json();

        if (data.success) {
          setOrderDetails(data.order);
          if (clearCart) clearCart();
        } else {
          setError(data.message || "We couldn’t load the order details.");
        }
      } catch (err) {
        setError("We couldn’t reach the server. Check your connection and try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [transactionUuid, clearCart]);

  if (loading) {
    return (
      <div className="order-status order-status--loading" role="status">
        <div className="spinner" />
        <p>Confirming your order…</p>
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState title="We couldn’t confirm this order" text={error}>
        <Link to="/" className="btn btn--primary">
          Back to home
        </Link>
      </EmptyState>
    );
  }

  return (
    <div className="order-status">
      <span className="order-status-icon order-status-icon--success">
        <Icon name="check" size={28} />
      </span>
      <h1 className="page-title display">Order confirmed</h1>
      <p className="order-status-text">
        Thank you for your purchase. Your payment went through and we’re getting your order ready.
      </p>

      {orderDetails && (
        <dl className="order-status-details">
          <div>
            <dt>Order ID</dt>
            <dd>{orderDetails.transactionUuid}</dd>
          </div>
          <div>
            <dt>Total</dt>
            <dd>{formatPrice(orderDetails.totalAmount)}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>
              {new Date(orderDetails.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd className="order-status-confirmed">
              <Icon name="check" size={16} />
              Confirmed
            </dd>
          </div>
        </dl>
      )}

      <p className="order-status-text">Your order should arrive within 3–5 business days.</p>

      <div className="order-status-actions">
        <Link to="/" className="btn btn--primary">
          Continue shopping
        </Link>
      </div>

      <p className="hint">
        Questions about your order?{" "}
        <a href="mailto:support@stepstyle.com" className="link">
          Contact support
        </a>
      </p>
    </div>
  );
};

export default SuccessPage;
