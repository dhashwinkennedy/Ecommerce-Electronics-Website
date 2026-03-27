import React from "react";
import { useNavigate } from "react-router-dom";
import "./HProductModel.css";
import { Star, StarHalf, StarOff } from "lucide-react";

const HProductModel = ({ product_details, variant, onRemove }) => {
  const navigate = useNavigate();

  const renderStars = (ratingValue) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (ratingValue >= i) {
        stars.push(<Star key={i} fill="#f5b50a" stroke="#f5b50a" size={16} />);
      } else if (ratingValue >= i - 0.5) {
        stars.push(
          <StarHalf key={i} fill="#f5b50a" stroke="#f5b50a" size={16} />,
        );
      } else {
        stars.push(<StarOff key={i} stroke="#ccc" size={16} />);
      }
    }
    return stars;
  };

  const renderName = (nameValue) => {
    if (!nameValue) return "";
    if (nameValue.length > 95) return nameValue.substring(0, 95) + "...";
    return nameValue;
  };

  const handleCardClick = () => {
    navigate(`/product/${product_details._id}`);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) onRemove(product_details._id);
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    navigate(`/product/${product_details._id}`);
  };

  return (
    <div className="main-product hsection-item" onClick={handleCardClick}>
      {/* discount badge — top right */}
      <div className="product-discount">
        <span className="discount-text">{product_details.discount}% off</span>
      </div>

      <img
        src={`/images/product_images/${product_details._id}/img.jpg`}
        alt={product_details.brand}
        className="img"
      />

      <div className="underline-full"></div>

      <div className="product-info">
        <span className="product-name">{renderName(product_details.name)}</span>

        {/* ✅ stars and count on same row */}
        <div className="rating-row">
          <div className="product-rating">
            {renderStars(product_details.rating)}
          </div>
          <span className="rating-count">
            ({product_details.total_rating} ratings)
          </span>
        </div>

        <div className="price-section">
          <span className="product-orgprice">₹{product_details.org_price}</span>
          <span className="product-price">₹{product_details.price}</span>
          {variant === "wishlist" ? (
            <button className="delete-button" onClick={handleRemove}>
              Remove
            </button>
          ) : (
            <button className="button" onClick={handleBuyNow}>
              Buy Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HProductModel;
