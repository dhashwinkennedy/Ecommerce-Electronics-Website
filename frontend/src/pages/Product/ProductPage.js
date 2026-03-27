import React, { useState, useRef, useEffect } from "react";
import "./ProductPage.css";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { Star, StarHalf, StarOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import PincodeInputPopup from "../../components/PincodeModel/PincodeInputPopup";
import ProductSpecModel from "./model/ProductSpecModel";
import AdditionalFeatureTable from "./model/AdditionalFeatureTable";
import PageLoader from "../../components/loaders/PageLoader";
import useHttp from "../../components/hooks/useHttp";

const ProductPage = () => {
  const { pid } = useParams();
  const navigate = useNavigate();
  const { pincode, setPincode, userId } = useAuth();
  const { isLoading, error, sendRequest } = useHttp();

  const [productDetails, setProductDetails] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const thumbnailContainerRef = useRef(null);
  const { isLoading: cartHttpLoading, sendRequest: cartSendRequest } =
    useHttp();
  const { isLoading: wishlistHttpLoading, sendRequest: wishlistSendRequest } =
    useHttp();

  // --- fetch product on mount ---
  useEffect(() => {
    const url = userId
      ? `http://localhost:5000/api/product/${pid}?userId=${userId}`
      : `http://localhost:5000/api/product/${pid}`;

    sendRequest({ url, method: "GET" }, (data) => {
      setProductDetails(data.product);
      setIsWishlisted(data.isWishlisted);
      setIsInCart(data.isInCart);
      setSelectedImage(
        data.product.other_imgs?.[0] || data.product.img_address,
      );
    });
  }, [pid, userId, sendRequest]);

  // --- thumbnail scroll ---
  const checkScrollLimits = (container) => {
    if (!container) return { isTop: true, isBottom: false };
    const tolerance = 5;
    return {
      isTop: container.scrollTop <= tolerance,
      isBottom:
        container.scrollHeight - container.clientHeight <=
        container.scrollTop + tolerance,
    };
  };

  useEffect(() => {
    const container = thumbnailContainerRef.current;
    if (!container) return;
    const limits = checkScrollLimits(container);
    setIsAtTop(limits.isTop);
    setIsAtBottom(limits.isBottom);
    const handleScroll = () => {
      const limits = checkScrollLimits(container);
      setIsAtTop(limits.isTop);
      setIsAtBottom(limits.isBottom);
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [productDetails]);

  const scrollThumbnails = (direction) => {
    if (thumbnailContainerRef.current) {
      const container = thumbnailContainerRef.current;
      container.scrollTop += direction === "up" ? -130 : 130;
      const limits = checkScrollLimits(container);
      setIsAtTop(limits.isTop);
      setIsAtBottom(limits.isBottom);
    }
  };

  // --- wishlist toggle ---
  const toggleWishlist = () => {
    if (!userId) {
      navigate("/signin");
      return;
    }

    const url = isWishlisted
      ? "http://localhost:5000/api/wishlist/remove"
      : "http://localhost:5000/api/wishlist/add";

    wishlistSendRequest(
      {
        url,
        method: isWishlisted ? "DELETE" : "POST",
        body: { userId, productId: pid },
      },
      () => setIsWishlisted((prev) => !prev),
    );
  };

  // --- add to cart ---
  const handleAddToCart = () => {
    if (!userId) {
      navigate("/signin");
      return;
    }
    if (isInCart) {
      navigate("/cart");
      return;
    }

    cartSendRequest(
      {
        url: "http://localhost:5000/api/cart/add",
        method: "POST",
        body: { userId, productId: pid, qty: 1 },
      },
      () => setIsInCart(true),
    );
  };

  // --- buy now ---
  const handleBuyNow = () => {
    if (!userId) {
      navigate("/signin");
      return;
    }

    // ✅ navigate to checkout with single product
    navigate("/checkout", {
      state: {
        products: [
          {
            _id: productDetails._id,
            name: productDetails.name,
            price: productDetails.price,
            org_price: productDetails.org_price,
            discount: productDetails.discount,
            rating: productDetails.rating,
            total_rating: productDetails.total_rating,
            img_address:
              productDetails.img_address ||
              `/images/product_images/${productDetails._id}/img.jpg`,
            qty: 1,
          },
        ],
        source: "buynow",
      },
    });
  };

  // --- stars ---
  const renderStars = (ratingValue) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (ratingValue >= i)
        stars.push(<Star key={i} fill="#f5b50a" stroke="#f5b50a" size={28} />);
      else if (ratingValue >= i - 0.5)
        stars.push(
          <StarHalf key={i} fill="#f5b50a" stroke="#f5b50a" size={28} />,
        );
      else stars.push(<StarOff key={i} stroke="#ccc" size={28} />);
    }
    return stars;
  };

  // --- box contents based on category ---
  const renderBoxContents = () => {
    const isLaptop = productDetails.category === "Laptop";
    return (
      <div>
        <div className="productpage-inside-box">
          <h3 className="btitle">What's inside the box?</h3>
          <span className="productpage-mini-point">
            ➔ {productDetails.category}
          </span>
          <span className="productpage-mini-point">➔ Charging Cable</span>
          {productDetails.charger > 0 && (
            <span className="productpage-mini-point">
              ➔ {productDetails.charger}W Adapter
            </span>
          )}
          {isLaptop && (
            <span className="productpage-mini-point">➔ Laptop Backpack</span>
          )}
          <span className="productpage-mini-point">➔ User Manual</span>
        </div>

        {isLaptop && (
          <div className="productpage-inside-box">
            <h3 className="btitle">Exclusive Benefits</h3>
            <span className="productpage-mini-point">➔ 1 Year Warranty</span>
            <span className="productpage-mini-point">➔ Office 2024</span>
            <span className="productpage-mini-point">
              ➔ Microsoft 365 (1yr)
            </span>
            <span className="productpage-mini-point">
              ➔ McAfee Total Security (1yr)
            </span>
            <span className="productpage-mini-point">
              ➔ Adobe Creative Cloud (1yr)
            </span>
            {productDetails.benefits && (
              <span className="productpage-mini-point">
                ➔ {productDetails.benefits}
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) return <PageLoader />;
  if (error)
    return (
      <p style={{ textAlign: "center", color: "red", marginTop: "2rem" }}>
        {error}
      </p>
    );
  if (!productDetails) return null;

  const allImages =
    productDetails.other_imgs?.length > 0
      ? productDetails.other_imgs
      : [productDetails.img_address];

  return (
    <div className="productpage">
      <div className="productpage-main-content">
        <div className="productpage-first-section">
          {/* LEFT: Thumbnail Gallery */}
          <div className="productpage-gallery-controls">
            <button
              onClick={() => scrollThumbnails("up")}
              disabled={isAtTop}
              className={`scroll-arrow ${isAtTop ? "disabled" : ""}`}
            >
              <IoIosArrowUp size={20} />
            </button>
            <div className="thumbnail-container" ref={thumbnailContainerRef}>
              {allImages.map((imgSrc, index) => (
                <img
                  key={index}
                  src={imgSrc}
                  alt={`Product thumbnail ${index + 1}`}
                  onClick={() => setSelectedImage(imgSrc)}
                  className={`thumbnail-item ${imgSrc === selectedImage ? "selected" : ""}`}
                />
              ))}
            </div>
            <button
              onClick={() => scrollThumbnails("down")}
              disabled={isAtBottom}
              className={`scroll-arrow ${isAtBottom ? "disabled" : ""}`}
            >
              <IoIosArrowDown size={20} />
            </button>
          </div>

          {/* CENTER: Main Image */}
          <div className="productpage-main-image-area">
            <button
              className={`wishlist-button ${isWishlisted ? "wishlisted" : ""}`}
              onClick={toggleWishlist}
              disabled={wishlistHttpLoading}
            >
              {isWishlisted ? (
                <FaRegHeart size={24} color="red" />
              ) : (
                <FaRegHeart size={24} />
              )}
            </button>
            <img
              src={selectedImage}
              alt={productDetails.brand}
              className="productpage-item-image"
            />
          </div>

          {/* RIGHT: Product Details */}
          <div className="productpage-details-column">
            <h2>{productDetails.name}</h2>
            <div className="productpage-details-mid">
              <div>
                <div className="productpage-rating-div">
                  <div className="productpage-item-rating">
                    {renderStars(productDetails.rating)}
                  </div>
                  <span className="productpage-rating-count">
                    ({productDetails.total_rating} ratings)
                  </span>
                </div>
                <div className="productpage-item-price-section">
                  <div className="productpage-discount-price">
                    <span className="productpage-item-price">
                      ₹{productDetails.price}
                    </span>
                    <span className="productpage-item-discount">
                      {productDetails.discount}% off
                    </span>
                  </div>
                  <span className="productpage-item-orgprice">
                    ₹{productDetails.org_price}
                  </span>
                </div>
                {renderBoxContents()}
              </div>

              <div className="productpage-buy-cart-component">
                <div className="row">
                  {productDetails.addon && (
                    <img
                      src={`/images/other_images/${productDetails.addon}.png`}
                      alt={productDetails.addon}
                      className="backpack-image"
                    />
                  )}
                  <div className="productpage-mid-item-price-section">
                    <div className="productpage-mid-discount-price">
                      <span className="productpage-mid-item-discount">
                        {productDetails.discount}% off
                      </span>
                      <span className="productpage-mid-item-price accent">
                        ₹{productDetails.price}
                      </span>
                    </div>
                    <span className="productpage-mid-promise-fee">
                      +₹99 Protect Promise Fee
                    </span>
                    <span className="productpage-mid-free-delivery">
                      +Free Delivery
                    </span>
                    {productDetails.addon && (
                      <span className="productpage-mid-backpackfree">
                        + Free {productDetails.addon}
                      </span>
                    )}
                  </div>
                </div>

                <div
                  className="productpage-location"
                  onClick={() => setIsPopupOpen(true)}
                >
                  <MapPin size={24} color="#FFC107" fill="#FFC107" />
                  <div className="productpage-location-text">
                    <span className="location-label">Deliver to:</span>
                    <span className="location-pincode">
                      {pincode || "Enter Pincode"}
                    </span>
                    <span className="location-change-text">
                      Click to change
                    </span>
                  </div>
                </div>

                <div className="productpage-mid-buttons-div">
                  <button
                    className="productpage-mid-cart-button"
                    onClick={handleAddToCart}
                    disabled={cartHttpLoading}
                  >
                    {cartHttpLoading
                      ? "Adding..."
                      : isInCart
                        ? "Go to Cart"
                        : "Add to Cart"}
                  </button>
                  <button
                    className="productpage-mid-buy-button"
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="productpage-second-section">
          <h2 className="productpage-second-section-title accent">
            About the Product
          </h2>
          <ProductSpecModel Data={productDetails} />
        </div>

        <div className="productpage-third-section">
          <h2 className="productpage-third-section-title accent">
            Key Features
          </h2>
          <AdditionalFeatureTable
            additional_features={productDetails.additional_features}
          />
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

export default ProductPage;
