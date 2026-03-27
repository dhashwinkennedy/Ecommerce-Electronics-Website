import React from "react";
import "./SearchProductModel.css";
import { Star, StarHalf, StarOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SearchProductModel = ({ details }) => {
  const navigate = useNavigate();

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

  const handleClick = () => {
    navigate(`/product/${details._id || details.id}`);
  };

  return (
    <div
      className="search-model-content"
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <img
        src={details.img_address}
        alt={details.brand}
        className="search-item-image"
      />
      <div className="search-underline-vertical"></div>
      <div className="search-item-details">
        <span className="search-item-name">{details.name}</span>
        <span className="search-item-discount">{details.discount}% off</span>

        <div className="search-rating-div">
          <div className="search-item-rating">
            {renderStars(details.rating)}
          </div>
          <span className="search-rating-count">
            ({details.total_rating} ratings)
          </span>
        </div>

        <div className="search-item-price-section">
          <span className="search-item-price">₹{details.price}</span>
          <span className="search-item-orgprice">₹{details.org_price}</span>
        </div>

        <div className="search-description-section">
          {details.processor && (
            <span className="search-description-span">
              Processor: {details.processor}
            </span>
          )}
          {details.ram && (
            <span className="search-description-span">RAM: {details.ram}</span>
          )}
          {details.storage && (
            <span className="search-description-span">
              Storage: {details.storage}
            </span>
          )}
          {details.category === "Laptop" && details.graphics && (
            <span className="search-description-span">
              Graphics: {details.graphics}
            </span>
          )}
          {details.OS && (
            <span className="search-description-span">OS: {details.OS}</span>
          )}
          {details.display && (
            <span className="search-description-span">
              Display: {details.display}
            </span>
          )}
          {details.refresh_rate && (
            <span className="search-description-span">
              Refresh Rate: {details.refresh_rate}
            </span>
          )}
          {details.category === "Laptop" && details.softwares && (
            <span className="search-description-span">
              Office 2024 {details.softwares}
            </span>
          )}
          {details.category === "Laptop" ? (
            <span className="search-description-span">
              With free Laptop Backpack
            </span>
          ) : details.category === "Mobile" ? (
            <span className="search-description-span">
              With free mobile Adapter
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SearchProductModel;
