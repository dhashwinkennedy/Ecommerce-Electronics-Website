import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaUser,
  FaMapMarkerAlt,
  FaHeart,
  FaSearch,
} from "react-icons/fa";
import "./NavLinks.css";
import PincodeInputPopup from "../PincodeModel/PincodeInputPopup";
import ProfileDrawer from "./models/ProfileDrawer";
import SideDrawer from "./models/SideDrawer";
import { useAuth } from "../../context/AuthContext";

const NavLinks = () => {
  const navigate = useNavigate();
  const { pincode, setPincode, isLoggedIn } = useAuth();

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenPincodeFromDrawer = () => {
    setIsSideDrawerOpen(false);
    setTimeout(() => setIsPopupOpen(true), 300);
  };

  const handleTogglePopup = (e) => {
    e.stopPropagation();
    setIsPopupOpen((prev) => !prev);
  };

  const handleSavePincode = (newPincode) => {
    setPincode(newPincode); // ✅ saves to context + localStorage
    setIsPopupOpen(false);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
    }
  };

  return (
    <>
      <ul className="nav-links">
        {/* Logo */}
        <li className="nav-logo">
          <NavLink to="/" end>
            <img src="/logo-main.png" alt="Home" className="logo-icon" />
          </NavLink>
        </li>

        {/* Location */}
        <li className="nav-location" onClick={handleTogglePopup}>
          <FaMapMarkerAlt className="nav-icon" />
          <span className="nav-pincode">{pincode}</span>
          <small className="nav-text">Click to change</small>
          {isPopupOpen && (
            <PincodeInputPopup
              currentPincode={pincode}
              onSave={handleSavePincode}
              onClose={() => setIsPopupOpen(false)}
            />
          )}
        </li>

        {/* Search Bar */}
        <li className="nav-search">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search for products..."
              className="search-input"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <div className="search-divider"></div>
            <button
              className="search-button"
              aria-label="Search"
              onClick={handleSearch}
            >
              <FaSearch className="search-icon" />
            </button>
          </div>
        </li>

        {/* My Orders */}
        <NavLink to={"/myorders"} end style={{ textDecoration: "none" }}>
          <li className="nav-items">
            <span>My Orders</span>
          </li>
        </NavLink>

        {/* Wishlist */}
        <NavLink to={"/wishlist"} end style={{ textDecoration: "none" }}>
          <li className="nav-items">
            <FaHeart className="nav-icon" />
            <span>Wishlist</span>
          </li>
        </NavLink>

        {/* Cart */}
        <NavLink to={"/cart"} end style={{ textDecoration: "none" }}>
          <li className="nav-items">
            <FaShoppingCart className="nav-icon" />
            <span>Cart</span>
          </li>
        </NavLink>

        {/* Profile */}
        <li className="nav-items" onClick={() => setIsProfilePopupOpen(true)}>
          <FaUser className="nav-icon" />
          <span>Profile</span>
        </li>

        {/* Drawer Menu Button */}
        <li className="drawer-menu">
          <button
            className="drawer-btn"
            onClick={() => setIsSideDrawerOpen(true)}
          >
            ☰
          </button>
        </li>
      </ul>

      <ProfileDrawer
        isOpen={isProfilePopupOpen}
        onClose={() => setIsProfilePopupOpen(false)}
      />
      <SideDrawer
        isOpen={isSideDrawerOpen}
        onClose={() => setIsSideDrawerOpen(false)}
        onOpenPincodePopup={handleOpenPincodeFromDrawer}
      />
    </>
  );
};

export default NavLinks;
