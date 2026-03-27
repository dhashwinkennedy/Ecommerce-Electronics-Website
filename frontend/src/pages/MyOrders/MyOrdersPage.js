import React, { useState, useEffect } from "react";
import "./MyOrdersPage.css";
import OrderModelProduct from "./OrderProductModel";
import PageLoader from "../../components/loaders/PageLoader";
import useHttp from "../../components/hooks/useHttp";
import { useAuth } from "../../context/AuthContext";

const MyOrdersPage = () => {
  const { userId } = useAuth();
  const { isLoading, error, sendRequest } = useHttp();
  const [ordersData, setOrdersData] = useState({
    ordersDB: [],
    orders_placed: 0,
    orders_pending: 0,
    orders_canceled: 0,
  });

  // --- fetch orders on mount ---
  useEffect(() => {
    if (!userId) return;
    sendRequest(
      {
        url: "http://localhost:5000/api/order",
        method: "POST",
        body: { userId },
      },
      (data) => {
        setOrdersData({
          ordersDB: data.orders.orders || [],
          orders_placed: data.orders.orders_placed || 0,
          orders_pending: data.orders.orders_pending || 0,
          orders_canceled: data.orders.orders_canceled || 0,
        });
      },
    );
  }, [userId, sendRequest]);

  // --- cancel order ---
  const handleCancelOrder = (orderId, productId) => {
    sendRequest(
      {
        url: "http://localhost:5000/api/order/cancel",
        method: "PATCH",
        body: { userId, orderId, productId },
      },
      (data) => {
        // update the specific order in state
        setOrdersData((prev) => ({
          ...prev,
          ordersDB: prev.ordersDB.map((order) =>
            order.orderId === orderId && order.productId === productId
              ? {
                  ...order,
                  status: "canceled",
                  paymentStatus: data.order.paymentStatus,
                }
              : order,
          ),
          orders_canceled: prev.orders_canceled + 1,
          orders_pending: prev.orders_pending - 1,
        }));
      },
    );
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="orderpage">
      <div className="orderpage-main-content">
        <h2 className="orderpage-main-title accent">My Orders</h2>

        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        {!userId && (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            Please log in to view your orders.
          </p>
        )}

        {userId && ordersData.ordersDB.length === 0 && !isLoading && (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            No orders found.
          </p>
        )}

        {userId && ordersData.ordersDB.length > 0 && (
          <div className="order-layout">
            {/* LEFT SIDE */}
            <div className="order-left">
              <div className="orderpage-items">
                {ordersData.ordersDB.map((productDetails, index) => (
                  <OrderModelProduct
                    key={`${productDetails.orderId}-${productDetails.productId}-${index}`}
                    details={productDetails}
                    onCancel={handleCancelOrder}
                  />
                ))}
              </div>
            </div>

            {/* SEPARATOR */}
            <div className="order-separator"></div>

            {/* RIGHT SIDE */}
            <div className="order-right">
              <h2 className="orderpage-main-title accent">Summary</h2>

              <div className="order-row">
                <span className="order-left-text">Orders Pending</span>
                <span className="order-right-text">
                  {ordersData.orders_pending}
                </span>
              </div>
              <div className="thin-black-line"></div>

              <div className="order-row">
                <span className="order-left-text">Orders Placed</span>
                <span className="order-right-text green">
                  {ordersData.orders_placed}
                </span>
              </div>
              <div className="order-black-line"></div>

              <div className="order-row">
                <span className="order-left-text">Orders Canceled</span>
                <span className="order-right-text red">
                  {ordersData.orders_canceled}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
