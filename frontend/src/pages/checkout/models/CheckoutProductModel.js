import React, { useMemo } from "react";
import "./CheckoutProductModel.css";
import { Star, StarHalf, StarOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CheckoutModelProduct = ({ details }) => {
  const navigate = useNavigate();

  // ✅ useMemo before any conditional return
  const deliveryDate = useMemo(() => {
    if (!details) return "";
    const today = new Date();
    const daysToAdd = Math.floor(Math.random() * 3) + 1;
    today.setDate(today.getDate() + daysToAdd);
    return today.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  }, [details]);

  // ✅ guard after all hooks
  if (!details) return null;

  const handleCardClick = () => {
    navigate(`/product/${details._id || details.productId || details.id}`);
  };

  const renderStars = (ratingValue) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (ratingValue >= i)
        stars.push(<Star key={i} fill="#f5b50a" stroke="#f5b50a" size={16} />);
      else if (ratingValue >= i - 0.5)
        stars.push(
          <StarHalf key={i} fill="#f5b50a" stroke="#f5b50a" size={16} />,
        );
      else stars.push(<StarOff key={i} stroke="#ccc" size={16} />);
    }
    return stars;
  };

  const renderName = (nameValue) => {
    if (!nameValue) return "Product";
    if (nameValue.length > 183) return nameValue.substring(0, 183) + "...";
    return nameValue;
  };

  return (
    <div
      className="checkout-model-content"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <img
        src={details.img_address}
        alt={details.brand}
        className="checkout-item-image"
      />
      <div className="checkout-underline-vertical"></div>
      <div className="checkout-item-details">
        <span className="checkout-item-name">
          {renderName(details.name || details.productName || "")}
        </span>

        <div className="checkout-item-meta-row">
          <span className="checkout-item-discount">
            {details.discount}% off
          </span>
          <span className="checkout-item-qty">Qty: {details.qty || 1}</span>
        </div>

        <div className="checkout-rating-div">
          <div className="checkout-item-rating">
            {renderStars(details.rating)}
          </div>
          <span className="checkout-rating-count">
            ({details.total_rating} ratings)
          </span>
        </div>

        <div className="checkout-item-price-section">
          <span className="checkout-item-price">₹{details.price}</span>
          <div className="checkout-delivery-info">
            <span className="checkout-delivery-label">Delivery by:</span>
            <span className="checkout-item-delivery">{deliveryDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutModelProduct;
