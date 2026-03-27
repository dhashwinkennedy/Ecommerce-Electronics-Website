import React, { useState, useEffect } from "react";
import "./WishlistPage.css";
import HSection from "../Home/models/HSection";
import PageLoader from "../../components/loaders/PageLoader";
import useHttp from "../../components/hooks/useHttp";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const WishlistPage = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const { isLoading, error, sendRequest } = useHttp();
  const [wishlistItems, setWishlistItems] = useState([]);

  // --- fetch wishlist on mount ---
  useEffect(() => {
    if (!userId) return;
    sendRequest(
      {
        url: "http://localhost:5000/api/wishlist",
        method: "POST",
        body: { userId },
      },
      (data) => {
        setWishlistItems(data.wishlist);
      },
    );
  }, [userId, sendRequest]);

  // --- remove from wishlist ---
  const handleRemove = (productId) => {
    sendRequest(
      {
        url: "http://localhost:5000/api/wishlist/remove",
        method: "DELETE",
        body: { userId, productId },
      },
      () => {
        setWishlistItems((prev) =>
          prev.filter((item) => item._id !== productId),
        );
      },
    );
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="page">
      <div className="main-content">
        <h2 className="main-title accent">My Wishlist</h2>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        {!userId && (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <p>Please log in to view your wishlist.</p>
            <button onClick={() => navigate("/signin")}>Log In</button>
          </div>
        )}

        {userId && wishlistItems.length === 0 && !isLoading && (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            Your wishlist is empty.
          </p>
        )}

        {userId && wishlistItems.length > 0 && (
          <HSection
            DB={wishlistItems}
            variant="wishlist"
            onRemove={handleRemove}
          />
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
