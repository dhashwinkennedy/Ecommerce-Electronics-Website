import React, { useState } from "react";
import "./OrderProductModel.css";
import { useNavigate } from "react-router-dom";

const OrderModelProduct = ({ details, onCancel }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const renderName = (nameValue) => {
    if (nameValue.length > 210) return nameValue.substring(0, 210) + "...";
    return nameValue;
  };

  const getStatusClass = () => {
    if (details.status === "delivered") return "status-badge delivered";
    if (details.status === "pending") return "status-badge pending";
    if (details.status === "canceled") return "status-badge canceled";
    return "status-badge";
  };

  const getDeliverySection = () => {
    if (details.status === "delivered") {
      return (
        <div className="order-delivery-info">
          <span className="order-delivery-label">Delivered On:</span>
          <span className="order-delivery-value">
            {details.deliveryDate || details.date}
          </span>
        </div>
      );
    } else if (details.status === "pending") {
      return (
        <div className="order-delivery-info">
          <span className="order-delivery-label">Delivery By:</span>
          <span className="order-delivery-value green">
            {details.deliveryDate || details.date}
          </span>
        </div>
      );
    } else if (details.status === "canceled") {
      return (
        <div className="order-delivery-info">
          <span className="order-delivery-value red">Canceled</span>
        </div>
      );
    }
  };

  return (
    <div className={`order-model-wrapper ${isExpanded ? "expanded" : ""}`}>
      {/* --- COLLAPSED VIEW --- */}
      <div
        className="order-model-content"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <img
          src={details.img_address}
          alt={details.brand}
          className="order-item-image"
        />
        <div className="order-underline-vertical"></div>
        <div className="order-item-details">
          <span className="order-item-name">
            {renderName(details.productName || details.name)}
          </span>
          <span className="order-item-orderId">
            OrderId: #{details.orderId || details.orderid}
          </span>
          <div className="order-item-price-section">
            <span className="order-item-price">₹{details.price}</span>
            <span className={getStatusClass()}>{details.status}</span>
          </div>
        </div>
        {getDeliverySection()}
        <span className={`order-expand-arrow ${isExpanded ? "up" : "down"}`}>
          &#8964;
        </span>
      </div>

      {/* --- EXPANDED VIEW --- */}
      {isExpanded && (
        <div className="order-expanded-section">
          <div className="order-expanded-details">
            <div className="order-detail-item">
              <span className="order-detail-label">Qty</span>
              <span className="order-detail-value">{details.qty || 1}</span>
            </div>
            <div className="order-detail-item">
              <span className="order-detail-label">Purchase Date</span>
              <span className="order-detail-value">
                {details.purchaseDate
                  ? new Date(details.purchaseDate).toLocaleDateString()
                  : details.date}
              </span>
            </div>
            <div className="order-detail-item">
              <span className="order-detail-label">Payment Method</span>
              <span className="order-detail-value">
                {details.paymentMode?.replace(/_/g, " ") || "—"}
              </span>
            </div>
            <div className="order-detail-item">
              <span className="order-detail-label">Payment Status</span>
              <span
                className={`order-detail-value payment-${details.paymentStatus}`}
              >
                {details.paymentStatus || "—"}
              </span>
            </div>
          </div>

          <div className="order-action-buttons">
            {/* cancel — only if status is pending */}
            {details.status === "pending" && (
              <button
                className="order-btn cancel-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onCancel) onCancel(details.orderId, details.productId);
                }}
              >
                Cancel Order
              </button>
            )}

            {/* pay now — only if payment status is pending */}
            {details.paymentStatus === "pending" &&
              details.status !== "canceled" && (
                <button
                  className="order-btn pay-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate("/payment", {
                      state: {
                        products: [
                          {
                            _id: details.productId,
                            name: details.productName,
                            price: details.price,
                            qty: details.qty || 1,
                            img_address: `/images/product_images/${details.productId}/img.jpg`,
                          },
                        ],
                        total: details.price * (details.qty || 1),
                        source: "orders", // ← add this
                      },
                    });
                  }}
                >
                  Pay Now
                </button>
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderModelProduct;
