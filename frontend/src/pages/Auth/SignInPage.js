import React, { useState } from "react";
import "./SignInPage.css";
import { NavLink, useNavigate } from "react-router-dom";
import useHttp from "../../components/hooks/useHttp";
import { useAuth } from "../../context/AuthContext";
import ButtonLoader from "../../components/loaders/ButtonLoader";

const SignInPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { isLoading, error, sendRequest, clearError } = useHttp();

  const [formData, setFormData] = useState({
    email_phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email_phone: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearError();
  };

  const validation_field = () => {
    let isValid = true;

    if (formData.email_phone.trim().length === 0) {
      setErrors((prev) => ({
        ...prev,
        email_phone: "Email or phone number is required",
      }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, email_phone: "" }));
    }

    if (formData.password.length === 0) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }

    return isValid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const isValid = validation_field();
    if (!isValid) return;

    sendRequest(
      {
        url: `http://localhost:5000/api/user/login`,
        method: "POST",
        body: {
          email_phone: formData.email_phone,
          password: formData.password,
        },
      },
      (data) => {
        // ✅ save to context and localStorage
        login(data.userId, data.token, data.user);

        // ✅ redirect to home after login
        navigate("/");
      },
    );
  };

  return (
    <div className="SignInPage">
      <div className="SignInPage-main-content">
        <h2 className="SignInPage-main-title accent">Log in to your account</h2>

        <div className="SignInPage-main-account-card">
          <form onSubmit={handleSubmit}>
            <img
              src="/logo-main.png"
              alt="Home"
              className="SignInPage-logo-icon"
            />
            <h2 className="SignInPage-page-subtitle">
              Welcome back!
              <br />
              Glad to see you again.
            </h2>

            {/* backend error */}
            {error && <span className="SignInPage-error-text">{error}</span>}

            {/* BLOCK 1: Email or Phone */}
            <div className="SignInPage-inp-grp">
              <label className="SignInPage-span-label">
                Email or Phone number
              </label>
              <input
                className={`SignInPage-text-inp${errors.email_phone ? "-error" : ""}`}
                type="text"
                name="email_phone"
                placeholder="Enter Email id or Phone number"
                value={formData.email_phone}
                onChange={handleChange}
              />
              {errors.email_phone && (
                <span className="SignInPage-field-error-text">
                  {errors.email_phone}
                </span>
              )}
            </div>

            {/* BLOCK 2: Password */}
            <div className="SignInPage-inp-grp">
              <label className="SignInPage-span-label">Password</label>
              <input
                className={`SignInPage-text-inp${errors.password ? "-error" : ""}`}
                type="password"
                name="password"
                value={formData.password}
                placeholder="Enter password"
                onChange={handleChange}
              />
              {errors.password && (
                <span className="SignInPage-field-error-text">
                  {errors.password}
                </span>
              )}
            </div>

            <button
              className="SignInPage-btn-enabled"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <ButtonLoader /> : "Sign in"}
            </button>

            <NavLink to="/signup" end style={{ textDecoration: "none" }}>
              <span className="SignInPage-textlink">
                Don't have an account?
                <br />
                Sign up
              </span>
            </NavLink>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
