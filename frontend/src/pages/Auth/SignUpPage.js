import React, { useState } from "react";
import "./SignUpPage.css";
import { NavLink, useNavigate } from "react-router-dom";
import useHttp from "../../components/hooks/useHttp";
import ButtonLoader from "../../components/loaders/ButtonLoader";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { isLoading, error, sendRequest, clearError } = useHttp();

  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    dob: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({
    firstName: "",
    surname: "",
    dob: "",
    email: "",
    phone: "",
    password: "",
    pass_match: "",
  });

  const nameRegex = /^[A-Za-z ]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearError();
  };

  const validation_field = () => {
    const firstName = formData.firstName.trim();
    const surname = formData.surname.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const password = formData.password;
    let isValid = true;

    // --- firstName ---
    if (firstName.length === 0) {
      setErrors((prev) => ({ ...prev, firstName: "First name is required" }));
      isValid = false;
    } else if (firstName.length < 3) {
      setErrors((prev) => ({
        ...prev,
        firstName: "Name should have at least 3 characters",
      }));
      isValid = false;
    } else if (firstName.length > 30) {
      setErrors((prev) => ({
        ...prev,
        firstName: "Name should not exceed 30 characters",
      }));
      isValid = false;
    } else if (!nameRegex.test(firstName)) {
      setErrors((prev) => ({
        ...prev,
        firstName: "Name cannot contain numbers or special characters",
      }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, firstName: "" }));
    }

    // --- Surname ---
    if (surname.length === 0) {
      setErrors((prev) => ({ ...prev, surname: "Surname is required" }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, surname: "" }));
    }

    // --- Email ---
    if (email.length === 0) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Enter a valid email address (e.g. name@example.com)",
      }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }

    // --- Phone ---
    if (phone.length === 0) {
      setErrors((prev) => ({ ...prev, phone: "Phone number is required" }));
      isValid = false;
    } else if (phone.replace(/\s/g, "").length !== 10) {
      setErrors((prev) => ({
        ...prev,
        phone: "Phone number must be exactly 10 digits",
      }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }

    // --- Password ---
    if (password.length === 0) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      isValid = false;
    } else if (password.length < 8) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 8 characters",
      }));
      isValid = false;
    } else if (password.length > 64) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must not exceed 64 characters",
      }));
      isValid = false;
    } else if (!passwordRegex.test(password)) {
      setErrors((prev) => ({
        ...prev,
        password:
          "Password must include uppercase, lowercase, number and special character (@$!%*?&)",
      }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }

    // --- DOB ---
    if (formData.dob.length === 0) {
      setErrors((prev) => ({ ...prev, dob: "Date of birth is required" }));
      isValid = false;
    } else {
      const today = new Date();
      const dob = new Date(formData.dob);
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate()))
        age--;

      if (age < 18) {
        setErrors((prev) => ({
          ...prev,
          dob: "You must be at least 18 years old to sign up",
        }));
        isValid = false;
      } else if (age > 120) {
        setErrors((prev) => ({
          ...prev,
          dob: "Please enter a valid date of birth",
        }));
        isValid = false;
      } else {
        setErrors((prev) => ({ ...prev, dob: "" }));
      }
    }

    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const isValid = validation_field();
    if (!isValid) return;

    if (formData.confirm_password !== formData.password) {
      setErrors((prev) => ({ ...prev, pass_match: "Passwords do not match" }));
      return;
    }

    setErrors((prev) => ({ ...prev, pass_match: "" }));

    // ✅ send to backend
    sendRequest(
      {
        url: "http://localhost:5000/api/user/signup",
        method: "POST",
        body: {
          firstName: formData.firstName,
          surname: formData.surname,
          dob: formData.dob,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        },
      },
      (data) => {
        // ✅ signup successful — redirect to login, don't log in automatically
        navigate("/signin");
      },
    );
  };

  return (
    <div className="SignUpPage">
      <div className="SignUpPage-main-content">
        <h2 className="SignUpPage-main-title accent">Create New Account</h2>

        <div className="SignUpPage-main-account-card">
          <form onSubmit={handleSubmit}>
            <img
              src="/logo-main.png"
              alt="Home"
              className="SignUpPage-logo-icon"
            />
            <h2 className="SignUpPage-page-subtitle">
              Get started with your <br /> account
            </h2>

            {/* ✅ backend error */}
            {error && <span className="SignUpPage-error-text">{error}</span>}

            {/* BLOCK 1: Name and Surname in a ROW */}
            <div className="SignUpPage-name-row-block">
              <img
                src="/profile/profile-logo.png"
                alt="user profile"
                className="SignUpPage-profile-pic"
              />
              <div className="SignUpPage-name-block">
                <div className="SignUpPage-inp-grp">
                  <label className="SignUpPage-span-label">First Name</label>
                  <input
                    className={`SignUpPage-smalltext-inp${errors.firstName ? "-error" : ""}`}
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  {errors.firstName && (
                    <span className="SignUpPage-field-error-text">
                      {errors.firstName}
                    </span>
                  )}
                </div>

                <div className="SignUpPage-inp-grp">
                  <label className="SignUpPage-span-label">Surname</label>
                  <input
                    className={`SignUpPage-smalltext-inp${errors.surname ? "-error" : ""}`}
                    type="text"
                    name="surname"
                    placeholder="Last Name"
                    value={formData.surname}
                    onChange={handleChange}
                  />
                  {errors.surname && (
                    <span className="SignUpPage-field-error-text">
                      {errors.surname}
                    </span>
                  )}
                </div>

                <div className="SignUpPage-inp-grp">
                  <label className="SignUpPage-span-label">Date of Birth</label>
                  <input
                    className={`SignUpPage-smalltext-inp${errors.dob ? "-error" : ""}`}
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                  {errors.dob && (
                    <span className="SignUpPage-field-error-text">
                      {errors.dob}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* BLOCK 2: Email */}
            <div className="SignUpPage-inp-grp">
              <label className="SignUpPage-span-label">Email</label>
              <input
                className={`SignUpPage-text-inp${errors.email ? "-error" : ""}`}
                type="email"
                name="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && (
                <span className="SignUpPage-field-error-text">
                  {errors.email}
                </span>
              )}
            </div>

            {/* BLOCK 3: Phone */}
            <div className="SignUpPage-inp-grp">
              <label className="SignUpPage-span-label">Phone Number</label>
              <input
                className={`SignUpPage-text-inp${errors.phone ? "-error" : ""}`}
                type="tel"
                name="phone"
                value={formData.phone}
                placeholder="+91 00000 00000"
                onChange={handleChange}
              />
              {errors.phone && (
                <span className="SignUpPage-field-error-text">
                  {errors.phone}
                </span>
              )}
            </div>

            {/* BLOCK 4: Password */}
            <div className="SignUpPage-inp-grp">
              <label className="SignUpPage-span-label">Password</label>
              <input
                className={`SignUpPage-text-inp${errors.password ? "-error" : ""}`}
                type="password"
                name="password"
                placeholder="Create New Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && (
                <span className="SignUpPage-field-error-text">
                  {errors.password}
                </span>
              )}
            </div>

            {/* BLOCK 5: Confirm Password */}
            <div className="SignUpPage-inp-grp">
              <label className="SignUpPage-span-label">Confirm Password</label>
              <input
                className={`SignUpPage-text-inp${errors.pass_match ? "-error" : ""}`}
                type="password"
                name="confirm_password"
                placeholder="Confirm Password"
                value={formData.confirm_password}
                onChange={handleChange}
              />
              {errors.pass_match && (
                <span className="SignUpPage-field-error-text">
                  {errors.pass_match}
                </span>
              )}
            </div>

            <button
              className="SignUpPage-btn-enabled"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <ButtonLoader /> : "Create Account"}
            </button>

            <NavLink to="/signin" end style={{ textDecoration: "none" }}>
              <span className="SignInPage-textlink">
                Already have an account?
                <br />
                Log in
              </span>
            </NavLink>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
