import React, { useState, useEffect } from "react";
import "./ProfilePage.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import useHttp from "../../components/hooks/useHttp";
import useForm from "../../components/hooks/useForm";
import PageLoader from "../../components/loaders/PageLoader";
import ButtonLoader from "../../components/loaders/ButtonLoader";

const AccountSettings = () => {
  const navigate = useNavigate();
  const { userId, logout } = useAuth();
  const { isLoading: pageLoading, sendRequest } = useHttp();
  const { isLoading: saveLoading, sendRequest: saveRequest } = useHttp();
  const { isLoading: deleteLoading, sendRequest: deleteRequest } = useHttp();

  const [userData, setUserData] = useState(null);
  const [isOrdersExpanded, setIsOrdersExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const { formData, errors, handleChange, setFormData } = useForm(
    {
      firstName: "",
      surname: "",
      email: "",
      phone: "",
      dob: "",
    },
    {
      firstName: {
        required: "First name is required",
        minLength: {
          value: 3,
          message: "Name should have at least 3 characters",
        },
      },
      surname: { required: "Surname is required" },
      email: {
        required: "Email is required",
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: "Enter a valid email",
        },
      },
      phone: {
        required: "Phone is required",
        pattern: {
          value: /^[0-9]{10}$/,
          message: "Phone must be exactly 10 digits",
        },
      },
      dob: { required: "Date of birth is required" },
    },
  );

  // --- fetch user data on mount ---
  useEffect(() => {
    if (!userId) {
      navigate("/signin");
      return;
    }

    sendRequest(
      {
        url: `${process.env.REACT_APP_URL}/api/user/${userId}`,
        method: "GET",
      },
      (data) => {
        setUserData(data.user);
        setFormData({
          firstName: data.user.firstName,
          surname: data.user.surname,
          email: data.user.email,
          phone: data.user.phone,
          dob: data.user.dob,
        });
      },
    );
  }, [userId, sendRequest, navigate, setFormData]);

  const toggleOrders = () => setIsOrdersExpanded(!isOrdersExpanded);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing && userData) {
      // reset form on cancel
      setFormData({
        firstName: userData.firstName,
        surname: userData.surname,
        email: userData.email,
        phone: userData.phone,
        dob: userData.dob,
      });
    }
  };

  // --- save changes ---
  const handleSave = () => {
    saveRequest(
      {
        url: `http://localhost:5000/api/user/update`,
        method: "PATCH",
        body: {
          UID: userId,
          firstName: formData.firstName,
          surname: formData.surname,
          email: formData.email,
          phone: formData.phone,
          dob: formData.dob,
        },
      },
      (data) => {
        setUserData(data.user);
        setIsEditing(false);
      },
    );
  };

  // --- delete account ---
  const handleDeleteConfirm = () => {
    if (!deletePassword) {
      setDeleteError("Password is required");
      return;
    }

    deleteRequest(
      {
        url: `http://localhost:5000/api/user/delete`,
        method: "POST",
        body: { UID: userId, password: deletePassword },
      },
      () => {
        logout();
        navigate("/signin");
      },
    );
  };

  // --- logout ---
  const handleLogout = () => {
    logout();
    navigate("/signin");
  };

  const CustomInput = ({
    label,
    name,
    value,
    type = "text",
    disabled = false,
  }) => (
    <div className="ProfilePage-input-group">
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={value || ""}
        className={
          disabled ? "ProfilePage-disabled-input" : "ProfilePage-editable-input"
        }
        disabled={disabled}
        onChange={!disabled ? handleChange : undefined}
      />
      {errors[name] && !disabled && (
        <span className="ProfilePage-field-error-text">{errors[name]}</span>
      )}
    </div>
  );

  const OrdersSection = () => (
    <div className="ProfilePage-orders-card">
      <div className="ProfilePage-orders-summary">
        <strong>Total Orders:</strong> {userData?.total_orders || 0}
      </div>
      <div
        className="ProfilePage-orders-dropdown-header"
        onClick={toggleOrders}
      >
        <span>View Order Breakdown</span>
        <span
          className={`ProfilePage-arrow ${isOrdersExpanded ? "up" : "down"}`}
        ></span>
      </div>
      <div
        className="ProfilePage-orders-breakdown-wrapper"
        style={{ maxHeight: isOrdersExpanded ? "300px" : "0" }}
      >
        <div className="ProfilePage-orders-breakdown-content">
          <p>
            Orders Completed: <strong>{userData?.completed_orders || 0}</strong>
          </p>
          <p>
            Orders Cancelled: <strong>{userData?.cancelled_orders || 0}</strong>
          </p>
          <p>
            Orders Pending Delivery:{" "}
            <strong>{userData?.pending_orders || 0}</strong>
          </p>
        </div>
      </div>
    </div>
  );

  const DeleteAccountSection = () => (
    <div className="ProfilePage-delete-section-wrapper">
      <h3 className="ProfilePage-delete-title">Account Management</h3>
      <p className="ProfilePage-delete-warning">
        Be cautious! Deleting your account is permanent.
      </p>
      <button
        className="btn-delete-account"
        onClick={() => setShowDeleteModal(true)}
      >
        Delete Account
      </button>
    </div>
  );

  const DeleteConfirmationModal = () => (
    <div className="ProfilePage-modal-backdrop">
      <div className="ProfilePage-modal-content">
        <h3 className="ProfilePage-modal-title">Confirm Account Deletion</h3>
        <p className="ProfilePage-modal-message">
          All {userData?.pending_orders || 0} pending orders will be
          automatically cancelled. This action cannot be undone.
        </p>

        {/* ✅ password confirmation before delete */}
        <div className="ProfilePage-input-group">
          <label>Enter your password to confirm</label>
          <input
            type="password"
            value={deletePassword}
            onChange={(e) => {
              setDeletePassword(e.target.value);
              setDeleteError("");
            }}
            className="ProfilePage-editable-input"
            placeholder="Enter password"
          />
          {deleteError && (
            <span className="ProfilePage-field-error-text">{deleteError}</span>
          )}
        </div>

        <div className="ProfilePage-modal-actions">
          <button
            className="btn-cancel"
            onClick={() => {
              setShowDeleteModal(false);
              setDeletePassword("");
              setDeleteError("");
            }}
          >
            Cancel
          </button>
          <button
            className="btn-confirm-delete"
            onClick={handleDeleteConfirm}
            disabled={deleteLoading}
          >
            {deleteLoading ? <ButtonLoader /> : "Yes, Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );

  if (pageLoading || !userData) return <PageLoader />;

  return (
    <div className="ProfilePage">
      <div className="ProfilePage-main-content">
        <h2 className="ProfilePage-main-title accent">My Account</h2>
        <div className="ProfilePage-main-account-card">
          {/* Left Section */}
          <div className="ProfilePage-left-section">
            <img
              src={userData.profilePic || "/profile/profile-logo.png"}
              alt="user profile"
              className="user-profile-pic"
            />
            <div className="ProfilePage-details-left">
              <span className="ProfilePage-Username">
                {formData.firstName} {formData.surname}
              </span>
              <span className="ProfilePage-Email">{formData.email}</span>
              <span className="ProfilePage-Phone">{formData.phone}</span>
            </div>
            <div className="ProfilePage-actions">
              <button
                className="btn-action btn-edit"
                onClick={handleEditToggle}
              >
                {isEditing ? "Cancel Edit" : "Edit Account"}
              </button>
              <button className="btn-action btn-logout" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          <div className="ProfilePage-card-separator"></div>

          {/* Right Section */}
          <div className="ProfilePage-right-section">
            <div className="ProfilePage-details-form">
              <CustomInput
                label="First Name"
                name="firstName"
                value={formData.firstName}
                disabled={!isEditing}
              />
              <CustomInput
                label="Surname"
                name="surname"
                value={formData.surname}
                disabled={!isEditing}
              />
              <div className="ProfilePage-input-group">
                <label>User ID</label>
                <div className="ProfilePage-user-id-text">{userData._id}</div>
              </div>
              <CustomInput
                label="Email"
                name="email"
                value={formData.email}
                type="email"
                disabled={!isEditing}
              />
              <CustomInput
                label="Phone Number"
                name="phone"
                value={formData.phone}
                type="tel"
                disabled={!isEditing}
              />
              <CustomInput
                label="Date of Birth"
                name="dob"
                value={formData.dob}
                type="date"
                disabled={!isEditing}
              />
            </div>

            {isEditing && (
              <button
                className="btn-save-changes"
                onClick={handleSave}
                disabled={saveLoading}
              >
                {saveLoading ? <ButtonLoader /> : "Save Changes"}
              </button>
            )}

            {!isEditing ? <OrdersSection /> : <DeleteAccountSection />}
          </div>
        </div>
      </div>

      {showDeleteModal && <DeleteConfirmationModal />}
    </div>
  );
};

export default AccountSettings;
