import React, { useState } from "react";
import "./PaymentPage.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useHttp from "../../components/hooks/useHttp";
import ButtonLoader from "../../components/loaders/ButtonLoader";

const PaymentPage = () => {
  const { userId } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { isLoading, error, sendRequest } = useHttp();

  const products = (state?.products || []).filter(Boolean);
  const total = state?.total || 0;
  const fromOrders = state?.source === "orders";

  const [paymentMode, setPaymentMode] = useState("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  const paymentOptions = [
    { value: "upi", label: "UPI" },
    { value: "credit_card", label: "Credit Card" },
    { value: "debit_card", label: "Debit Card" },
    { value: "net_banking", label: "Net Banking" },
    { value: "cash_on_delivery", label: "Cash on Delivery" },
  ];

  // ✅ invalid access guard
  if (!state || products.length === 0) {
    return (
      <div className="paymentpage">
        <div className="paymentpage-main-content">
          <div className="payment-success">
            <div className="success-icon" style={{ background: "#e53935" }}>
              ✕
            </div>
            <h2 className="payment-success-title">Invalid Access</h2>
            <p className="payment-success-msg">
              You cannot access this page directly.
            </p>
            <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
              <button
                className="checkout-button"
                style={{ width: "160px", height: "44px", fontSize: "1rem" }}
                onClick={() => navigate("/cart")}
              >
                Go to Cart
              </button>
              <button
                className="checkout-button"
                style={{
                  width: "160px",
                  height: "44px",
                  fontSize: "1rem",
                  background: "#fff",
                  color: "#f4b000",
                  border: "2px solid #f4b000",
                }}
                onClick={() => navigate("/")}
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const validate = () => {
    if (paymentMode === "upi" && !upiId.trim()) {
      setFormError("Please enter your UPI ID");
      return false;
    }
    if (paymentMode === "credit_card" || paymentMode === "debit_card") {
      if (!cardNumber.trim() || cardNumber.replace(/\s/g, "").length !== 16) {
        setFormError("Please enter a valid 16-digit card number");
        return false;
      }
      if (!cardName.trim()) {
        setFormError("Please enter the cardholder name");
        return false;
      }
      if (!cardExpiry.trim()) {
        setFormError("Please enter card expiry");
        return false;
      }
      if (!cardCvv.trim() || cardCvv.length !== 3) {
        setFormError("Please enter a valid 3-digit CVV");
        return false;
      }
    }
    setFormError("");
    return true;
  };

  const handlePlaceOrder = () => {
    if (!validate()) return;

    sendRequest(
      {
        url: "http://localhost:5000/api/order/new",
        method: "POST",
        body: {
          userId,
          products: products.map((p) => ({
            productId: p._id || p.productId,
            productName: p.name || p.productName,
            price: p.price,
            qty: p.qty || 1,
          })),
          paymentMode,
        },
      },
      () => {
        setPaymentSuccess(true);
        setTimeout(() => navigate("/myorders"), 3000);
      },
    );
  };

  // ✅ success screen
  if (paymentSuccess) {
    return (
      <div className="paymentpage">
        <div className="paymentpage-main-content">
          <div className="payment-success">
            <div className="success-icon">✓</div>
            <h2 className="payment-success-title">
              Order Placed Successfully!
            </h2>
            <p className="payment-success-msg">
              Your order has been placed. Redirecting to your orders...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="paymentpage">
      <div className="paymentpage-main-content">
        <h2 className="paymentpage-main-title accent">Payment</h2>

        {error && <p className="payment-error">{error}</p>}

        <div className="payment-layout">
          {/* LEFT — payment form */}
          <div className="payment-left">
            <h3 className="payment-section-title">Select Payment Method</h3>
            <div className="payment-options">
              {paymentOptions.map((option) => (
                <div
                  key={option.value}
                  className={`payment-option
                    ${paymentMode === option.value ? "selected" : ""}
                    ${option.value === "cash_on_delivery" && fromOrders ? "disabled" : ""}`}
                  onClick={() => {
                    if (option.value === "cash_on_delivery" && fromOrders)
                      return;
                    setPaymentMode(option.value);
                    setFormError("");
                  }}
                >
                  <div className="payment-option-radio">
                    {paymentMode === option.value && (
                      <div className="radio-dot" />
                    )}
                  </div>
                  <span>{option.label}</span>
                  {option.value === "cash_on_delivery" && fromOrders && (
                    <span className="payment-option-disabled-tag">
                      Not available
                    </span>
                  )}
                </div>
              ))}
            </div>

            {paymentMode === "upi" && (
              <div className="payment-form">
                <h3 className="payment-section-title">Enter UPI ID</h3>
                <div className="payment-input-group">
                  <label>UPI ID</label>
                  <input
                    type="text"
                    placeholder="yourname@upi"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="payment-input"
                  />
                </div>
              </div>
            )}

            {(paymentMode === "credit_card" ||
              paymentMode === "debit_card") && (
              <div className="payment-form">
                <h3 className="payment-section-title">Enter Card Details</h3>
                <div className="payment-input-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    maxLength={19}
                    onChange={(e) => {
                      const val = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 16);
                      setCardNumber(val.replace(/(.{4})/g, "$1 ").trim());
                    }}
                    className="payment-input"
                  />
                </div>
                <div className="payment-input-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    placeholder="Name on card"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="payment-input"
                  />
                </div>
                <div className="payment-input-row">
                  <div className="payment-input-group">
                    <label>Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      maxLength={5}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, "").slice(0, 4);
                        if (val.length > 2)
                          val = val.slice(0, 2) + "/" + val.slice(2);
                        setCardExpiry(val);
                      }}
                      className="payment-input"
                    />
                  </div>
                  <div className="payment-input-group">
                    <label>CVV</label>
                    <input
                      type="password"
                      placeholder="•••"
                      value={cardCvv}
                      maxLength={3}
                      onChange={(e) =>
                        setCardCvv(
                          e.target.value.replace(/\D/g, "").slice(0, 3),
                        )
                      }
                      className="payment-input"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMode === "net_banking" && (
              <div className="payment-form">
                <h3 className="payment-section-title">Net Banking</h3>
                <p className="payment-info-text">
                  You will be redirected to your bank's portal to complete the
                  payment.
                </p>
              </div>
            )}

            {paymentMode === "cash_on_delivery" && (
              <div className="payment-form">
                <h3 className="payment-section-title">Cash on Delivery</h3>
                <p className="payment-info-text">
                  Pay when your order arrives at your doorstep.
                </p>
              </div>
            )}

            {formError && <p className="payment-field-error">{formError}</p>}
          </div>

          {/* SEPARATOR */}
          <div className="cart-separator"></div>

          {/* RIGHT — order summary */}
          <div className="payment-right">
            <h3 className="payment-section-title">Order Summary</h3>

            <div className="payment-products">
              {products.map((p, i) => (
                <div key={i} className="payment-product-row">
                  <img
                    src={p.img_address}
                    alt={p.brand}
                    className="payment-product-img"
                  />
                  <div className="payment-product-info">
                    <span className="payment-product-name">
                      {p.name?.length > 60
                        ? p.name.substring(0, 60) + "..."
                        : p.name}
                    </span>
                    <span className="payment-product-qty">
                      Qty: {p.qty || 1}
                    </span>
                    <span className="payment-product-price">₹{p.price}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="thin-black-line" style={{ margin: "16px 0" }}></div>

            <div className="cart-row">
              <span
                className="cart-left-text"
                style={{ fontSize: "1.3rem", fontWeight: "700" }}
              >
                Total
              </span>
              <span
                className="cart-right-text"
                style={{ fontSize: "1.3rem", fontWeight: "700" }}
              >
                ₹{total}
              </span>
            </div>

            <button
              className="checkout-button"
              onClick={handlePlaceOrder}
              disabled={isLoading}
            >
              {isLoading ? <ButtonLoader /> : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
