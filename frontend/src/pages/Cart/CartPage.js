import React, { useState, useEffect } from "react";
import "./CartPage.css";
import CartModelProduct from "./models/CartProductModel";
import PageLoader from "../../components/loaders/PageLoader";
import useHttp from "../../components/hooks/useHttp";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const { userId } = useAuth();
  const { isLoading, error, sendRequest } = useHttp();
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;
    sendRequest(
      {
        url: "http://localhost:5000/api/cart",
        method: "POST",
        body: { userId },
      },
      (data) => setCartItems(data.cart),
    );
  }, [userId, sendRequest]);

  const handleRemove = (productId) => {
    sendRequest(
      {
        url: "http://localhost:5000/api/cart/remove",
        method: "DELETE",
        body: { userId, productId },
      },
      (data) => setCartItems(data.cart),
    );
  };

  const handleQtyUpdate = (productId, qty) => {
    sendRequest(
      {
        url: "http://localhost:5000/api/cart/update",
        method: "PATCH",
        body: { userId, productId, qty },
      },
      (data) => setCartItems(data.cart),
    );
  };

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
    calculateSummary(cartItems);

  // ✅ navigate to checkout with all cart items
  const handleCheckout = () => {
    navigate("/checkout", { state: { products: cartItems, source: "cart" } });
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="cartpage">
      <div className="cartpage-main-content">
        <h2 className="cartpage-main-title accent">My Cart</h2>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        {!userId && (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            Please log in to view your cart.
          </p>
        )}

        {userId && cartItems.length === 0 && !isLoading && (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            Your cart is empty.
          </p>
        )}

        {userId && cartItems.length > 0 && (
          <div className="cart-layout">
            <div className="cart-left">
              <div className="cartpage-items">
                {cartItems.map((productDetails) => (
                  <CartModelProduct
                    key={productDetails._id || productDetails.id}
                    details={productDetails}
                    onRemove={handleRemove}
                    onQtyChange={handleQtyUpdate}
                  />
                ))}
              </div>
            </div>

            <div className="cart-separator"></div>

            <div className="cart-right">
              <h2 className="cartpage-main-title accent">Summary</h2>

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

              {/* ✅ checkout navigates with products */}
              <button
                className="checkout-button"
                onClick={handleCheckout}
                disabled={isLoading}
              >
                Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
