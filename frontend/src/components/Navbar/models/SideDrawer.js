import React, { useState } from "react";
import {
  FaHome,
  FaUser,
  FaShoppingCart,
  FaHeart,
  FaClipboardList,
  FaHeadset,
  FaPhoneAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import "./SideDrawer.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import PincodeInputPopup from "../../PincodeModel/PincodeInputPopup";

const SideDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { pincode, setPincode, isLoggedIn, logout } = useAuth();
  const [isPincodeOpen, setIsPincodeOpen] = useState(false);

  if (!isOpen) return null;

  const menuItems = [
    { icon: <FaHome />, label: "Home", link: "/" },
    { icon: <FaClipboardList />, label: "My Orders", link: "/myorders" },
    { icon: <FaHeart />, label: "Wishlist", link: "/wishlist" },
    { icon: <FaShoppingCart />, label: "Cart", link: "/cart" },
    { icon: <FaUser />, label: "Profile", link: "/profile" },
  ];

  const handleSavePincode = (newPincode) => {
    setPincode(newPincode); // ✅ saves to context + localStorage
    setIsPincodeOpen(false);
  };

  return (
    <>
      <div className="side-drawer-overlay" onClick={onClose}>
        <div
          className={`side-drawer right ${isOpen ? "open" : ""}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="side-drawer-header">
            <h2>Menu</h2>
            <button className="close-btn" onClick={onClose}>
              ✖
            </button>
          </div>

          <ul className="side-drawer-list">
            {menuItems.map((item, index) => (
              <li
                key={index}
                onClick={() => {
                  onClose();
                  navigate(item.link);
                }}
              >
                <span className="drawer-icon">{item.icon}</span>
                <span className="drawer-text">{item.label}</span>
              </li>
            ))}

            {/* ✅ show login/logout based on auth state */}
            {isLoggedIn ? (
              <li
                onClick={() => {
                  logout();
                  onClose();
                  navigate("/signin");
                }}
              >
                <span className="drawer-icon">
                  <FaUser />
                </span>
                <span className="drawer-text">Logout</span>
              </li>
            ) : (
              <li
                onClick={() => {
                  onClose();
                  navigate("/signin");
                }}
              >
                <span className="drawer-icon">
                  <FaUser />
                </span>
                <span className="drawer-text">Login</span>
              </li>
            )}
          </ul>

          {/* Pincode Section */}
          <div
            className="drawer-location footer"
            onClick={() => setIsPincodeOpen(true)}
          >
            <FaMapMarkerAlt className="drawer-icon" />
            <div className="location-text">
              <span className="pincode-label">Deliver to:</span>
              <span className="pincode-value">{pincode}</span>
              <small className="pincode-change">Click to change</small>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ PincodeInputPopup used directly inside SideDrawer */}
      {isPincodeOpen && (
        <PincodeInputPopup
          currentPincode={pincode}
          onSave={handleSavePincode}
          onClose={() => setIsPincodeOpen(false)}
        />
      )}
    </>
  );
};

export default SideDrawer;
