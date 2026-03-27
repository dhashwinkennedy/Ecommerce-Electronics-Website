import React, { useState } from "react";
import "./CheckoutPage.css";
import CheckoutModelProduct from "./models/CheckoutProductModel";
import { useAuth } from "../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import PincodeInputPopup from "../../components/PincodeModel/PincodeInputPopup";

import { FaMapMarkerAlt } from "react-icons/fa";

const CheckoutPage = () => {
  const { userId, pincode, setPincode } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // ✅ get products from navigation state
  const products = (state?.products || []).filter(Boolean); // ← filter out undefined/null

  const calculateSummary = (items) => {
    if (!items || items.length === 0)
      return {
        subtotal: 0,
        protectPromiseFee: 0,
        handlingCharges: 99,
        total: 99,
      };
    const subtotal = items.reduce(
      (total, item) => total + item.price * (item.qty || 1),
      0,
    );
    const protectPromiseFee = items.length * 99;
    const handlingCharges = 99;
    const total = subtotal + protectPromiseFee + handlingCharges;
    return { subtotal, protectPromiseFee, handlingCharges, total };
  };

  const { subtotal, protectPromiseFee, handlingCharges, total } =
    calculateSummary(products);

  if (!userId) {
    navigate("/signin");
    return null;
  }

  if (products.length === 0) {
    return (
      <div className="checkoutpage">
        <div className="checkoutpage-main-content">
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            No products to checkout.{" "}
            <span
              style={{ color: "#f4b000", cursor: "pointer" }}
              onClick={() => navigate("/cart")}
            >
              Go to Cart
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="checkoutpage">
      <div className="checkoutpage-main-content">
        <h2 className="checkoutpage-main-title accent">Checkout</h2>

        <div className="cart-layout">
          {/* LEFT SIDE */}
          <div className="cart-left">
            <div className="cartpage-items">
              {products.map((productDetails) => (
                <CheckoutModelProduct
                  key={productDetails._id || productDetails.id}
                  details={productDetails}
                />
              ))}
            </div>
          </div>

          {/* SEPARATOR */}
          <div className="cart-separator"></div>

          {/* RIGHT SIDE */}
          <div className="cart-right">
            <h2 className="checkoutpage-main-title accent">Order Details</h2>

            <div className="cart-row">
              <span className="cart-left-text">Subtotal</span>
              <span className="cart-right-text">₹{subtotal}</span>
            </div>
            <div className="thin-black-line"></div>

            <div className="cart-row">
              <span className="cart-left-text">Handling Charges</span>
              <span className="cart-right-text">₹{handlingCharges}</span>
            </div>
            <div className="thin-black-line"></div>

            <div className="cart-row">
              <span className="cart-left-text">Protect Promise Fee</span>
              <span className="cart-right-text">₹{protectPromiseFee}</span>
            </div>
            <div className="thin-black-line"></div>

            <div className="cart-row">
              <span className="cart-left-text">Delivery Fee</span>
              <span className="cart-right-text green">Free</span>
            </div>
            <div className="thin-black-line"></div>

            <div className="cart-row">
              <span
                className="cart-left-text"
                style={{ fontSize: "1.5rem", fontWeight: "700" }}
              >
                Total
              </span>
              <span
                className="cart-right-text"
                style={{ fontSize: "1.5rem", fontWeight: "700" }}
              >
                ₹{total}
              </span>
            </div>
            <div
              className="drawer-location footer"
              onClick={() => setIsPopupOpen(true)}
            >
              <FaMapMarkerAlt className="drawer-icon" />
              <div className="location-text">
                <span className="pincode-label">Deliver to:</span>
                <span className="pincode-value">
                  {pincode || "Enter Pincode"}
                </span>
                <small className="pincode-change">Click to change</small>
              </div>
            </div>
            {/* ✅ dummy for now */}
            <button
              className="checkout-button"
              onClick={() =>
                navigate("/payment", {
                  state: { products, total },
                })
              }
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <PincodeInputPopup
          currentPincode={pincode}
          onSave={(newPincode) => {
            setPincode(newPincode);
            setIsPopupOpen(false);
          }}
          onClose={() => setIsPopupOpen(false)}
        />
      )}
    </div>
  );
};

export default CheckoutPage;
