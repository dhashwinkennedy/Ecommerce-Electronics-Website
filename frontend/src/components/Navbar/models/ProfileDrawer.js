import React from "react";
import "./ProfileDrawer.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const ProfileDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { userData, logout, isLoggedIn } = useAuth();

  if (!isOpen) return null;

  const maskEmail = (email) => {
    const [name, domain] = email.split("@");
    return name.slice(0, 3) + "****@" + domain;
  };

  const maskPhone = (phone) => {
    return phone.slice(0, 2) + "****" + phone.slice(-3);
  };

  const handleLogout = () => {
    logout();
    onClose();
    navigate("/signin");
  };

  return (
    <div className="profile-drawer-overlay" onClick={onClose}>
      <div
        className="profile-drawer-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <h2>My Profile</h2>
          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        {isLoggedIn && userData ? (
          <>
            <div className="Profile-Drawer-current-user-card">
              <img
                src={userData.profilePic || "/profile/profile-logo.png"}
                alt="user profile"
                className="user-profile"
              />
              <span className="Profile-Drawer-Username">
                {userData.firstName} {userData.surname}
              </span>
              <span className="Profile-Drawer-Email">
                {maskEmail(userData.email)}
              </span>
              {userData.phone && (
                <span className="Profile-Drawer-Phone">
                  {maskPhone(userData.phone)}
                </span>
              )}
            </div>

            <div className="profile-actions">
              <button
                className="settings-btn"
                onClick={() => {
                  onClose();
                  navigate("/profile");
                }}
              >
                Account Settings
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </>
        ) : (
          // ✅ not logged in state
          <div className="profile-actions">
            <p style={{ textAlign: "center", color: "#888", margin: "1rem 0" }}>
              Please log in to view your profile
            </p>
            <button
              className="settings-btn"
              onClick={() => {
                onClose();
                navigate("/signin");
              }}
            >
              Log In
            </button>
            <button
              className="logout-btn"
              onClick={() => {
                onClose();
                navigate("/signup");
              }}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDrawer;
