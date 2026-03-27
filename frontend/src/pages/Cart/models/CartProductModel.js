import React, { useState } from "react";
import "./CartProductModel.css";
import { Star, StarHalf, StarOff } from "lucide-react";
import { MdDelete } from "react-icons/md";
import ButtonLoader from "../../../components/loaders/ButtonLoader";
import useHttp from "../../../components/hooks/useHttp";
import { useNavigate } from "react-router-dom";

const CartModelProduct = ({
  details,
  variant = "cartpage",
  onRemove,
  onQtyChange,
}) => {
  const [qty, setQty] = useState(details.qty || 1);
  const { isLoading } = useHttp();
  const navigate = useNavigate();

  const increase = (e) => {
    e.stopPropagation();
    if (qty < 10) {
      const newQty = qty + 1;
      setQty(newQty);
      if (onQtyChange)
        onQtyChange(details._id || details.productId || details.id, newQty);
    }
  };

  const decrease = (e) => {
    e.stopPropagation();
    if (qty === 1) {
      // ✅ if qty is 1, clicking delete removes the product
      if (onRemove) onRemove(details._id || details.productId || details.id);
      return;
    }
    const newQty = qty - 1;
    setQty(newQty);
    if (onQtyChange)
      onQtyChange(details._id || details.productId || details.id, newQty);
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    if (onRemove) onRemove(details._id || details.productId || details.id);
  };

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

  const discountOrOrderId = () => {
    if (variant === "orderpage")
      return <span className="order-id">Order ID: #{details.orderid}</span>;
    if (variant === "cartpage")
      return (
        <span className="cart-item-discount">{details.discount}% off</span>
      );
  };

  const ratingOrDelivery = () => {
    if (variant === "orderpage" && details.status === "not delivered") {
      return (
        <div className="cart-delivery-info">
          <span className="cart-item-delivery">
            Delivery on: {details.date}
          </span>
        </div>
      );
    } else if (variant === "orderpage" && details.status === "delivered") {
      return (
        <div className="delivered-on">
          <span>Delivered on: {details.date}</span>
        </div>
      );
    } else if (variant === "orderpage" && details.status === "cancelled") {
      return null;
    } else if (variant === "searchpage" || variant === "cartpage") {
      return (
        // ✅ rating row fixed
        <div className="cart-rating-div">
          <div className="cart-item-rating">{renderStars(details.rating)}</div>
          <span className="cart-rating-count">
            ({details.total_rating} ratings)
          </span>
        </div>
      );
    }
  };

  const bottomRightSection = () => {
    if (variant === "cartpage") {
      return (
        <div className="cart-bottom-right">
          <button
            className="cart-delete-button"
            onClick={handleRemove}
            disabled={isLoading}
          >
            {isLoading ? <ButtonLoader /> : "Remove"}
          </button>
          <div className="qty-box">
            {/* ✅ green delete icon when qty === 1 */}
            <button
              className={`qty-btn ${qty === 1 ? "qty-btn-delete" : ""}`}
              onClick={decrease}
              disabled={isLoading}
            >
              {qty === 1 ? <MdDelete size={18} /> : "-"}
            </button>
            <span className="qty-value">{qty}</span>
            <button
              className="qty-btn"
              onClick={increase}
              disabled={qty === 10 || isLoading}
            >
              +
            </button>
          </div>
        </div>
      );
    }
    if (variant === "orderpage")
      return <span className="cart-item-delivery">{details.date}</span>;
    if (variant === "delivered")
      return <span className="cart-item-delivery">{details.date}</span>;
    if (variant === "cancelled")
      return <span style={{ color: "red", fontWeight: "600" }}>Cancelled</span>;
    return null;
  };

  return (
    <div
      className="cart-model-content"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <img
        src={details.img_address}
        alt={details.brand}
        className="cart-item-image"
      />
      <div className="cart-underline-vertical"></div>
      <div className="cart-item-details">
        <span className="cart-item-name">
          {renderName(details.name || details.productName || "")}
        </span>
        {discountOrOrderId()}
        {ratingOrDelivery()}
        <div className="cart-item-price-section">
          <span className="cart-item-orgprice">₹{details.org_price}</span>
          <span className="cart-item-price">₹{details.price}</span>
          {bottomRightSection()}
        </div>
      </div>
    </div>
  );
};

export default CartModelProduct;
