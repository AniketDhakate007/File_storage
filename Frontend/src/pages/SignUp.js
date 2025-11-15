// src/pages/SignUp.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const defaultConfig = {
  page_title: "Create Your Account",
  page_subtitle: "Join thousands of users securely storing their files in the cloud",
  name_label: "Full Name",
  email_label: "Email Address",
  password_label: "Password",
  confirm_password_label: "Confirm Password",
  signup_button: "Sign Up",
  login_text: "Already have an account?",
  login_link: "Login here",
  primary_color: "#6366f1", // Indigo
  secondary_color: "#8b5cf6", // Purple
  background_color: "#eef2ff", // Light indigo
  surface_color: "#ffffff",
  text_color: "#1e293b",
  font_family: "Inter",
  font_size: 16,
};

function SignUp() {
  const navigate = useNavigate();
  const [config] = useState(defaultConfig);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [errors, setErrors] = useState({});

  const {
    primary_color,
    secondary_color,
    text_color,
    font_size,
    font_family,
  } = config;

  useEffect(() => {
    document.body.style.background = `linear-gradient(135deg, ${primary_color}, ${secondary_color}, #7dd3fc)`;
    document.body.style.fontFamily = `${font_family}, sans-serif`;
  }, [primary_color, secondary_color, font_family]);

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 10;
    return Math.min(strength, 100);
  };

  const getStrengthColor = (strength) => {
    if (strength < 40) return "#ef4444";
    if (strength < 70) return "#f59e0b";
    return "#10b981";
  };

  const getStrengthText = (strength) => {
    if (strength === 0) return "";
    if (strength < 40) return "Weak";
    if (strength < 70) return "Medium";
    return "Strong";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") setPasswordStrength(calculatePasswordStrength(value));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Enter a valid email";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Please fix the errors in the form");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigate("/login");
    }, 1500);
  };

  const handleBack = () => navigate(-1);
  const handleHome = () => navigate("/");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ☁️ Floating icons */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          fontSize: "80px",
          opacity: 0.1,
        }}
      >
        ☁️
      </motion.div>

      <motion.div
        animate={{ y: [0, 25, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          fontSize: "100px",
          opacity: 0.1,
        }}
      >
        📁
      </motion.div>

      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "65%",
          left: "12%",
          fontSize: "60px",
          opacity: 0.1,
        }}
      >
        🔒
      </motion.div>

      {/* 🏠 Home & Back Buttons */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          display: "flex",
          gap: "10px",
        }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          style={{
            background: "#ffffff",
            border: `2px solid ${primary_color}`,
            borderRadius: "8px",
            padding: "8px 16px",
            cursor: "pointer",
            color: primary_color,
            fontWeight: 600,
          }}
        >
          🔙 Back
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleHome}
          style={{
            background: `linear-gradient(135deg, ${primary_color}, ${secondary_color})`,
            border: "none",
            borderRadius: "8px",
            padding: "8px 16px",
            cursor: "pointer",
            color: "white",
            fontWeight: 600,
          }}
        >
          🏠 Home
        </motion.button>
      </div>

      {/* SignUp Card */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "24px",
          boxShadow: "0 25px 70px rgba(0, 0, 0, 0.12)",
          padding: "48px",
          maxWidth: "520px",
          width: "100%",
          zIndex: 1,
        }}
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          style={{
            width: "90px",
            height: "90px",
            margin: "0 auto 20px",
            background: `linear-gradient(135deg, ${primary_color}, ${secondary_color})`,
            borderRadius: "22px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "48px",
            boxShadow: `0 12px 35px ${primary_color}50`,
          }}
        >
          ☁️
        </motion.div>

        <h1
          style={{
            textAlign: "center",
            fontSize: `${font_size * 2}px`,
            fontWeight: 700,
            color: text_color,
            marginBottom: "8px",
          }}
        >
          {config.page_title}
        </h1>
        <p
          style={{
            textAlign: "center",
            color: text_color,
            opacity: 0.6,
            marginBottom: "24px",
          }}
        >
          {config.page_subtitle}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Full Name */}
          <div>
            <label style={{ fontWeight: 600, color: text_color }}>{config.name_label}</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="John Doe"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: `2px solid ${errors.fullName ? "#ef4444" : text_color + "20"}`,
                marginTop: "8px",
              }}
            />
            {errors.fullName && <p style={{ color: "#ef4444" }}>{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label style={{ fontWeight: 600, color: text_color }}>{config.email_label}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: `2px solid ${errors.email ? "#ef4444" : text_color + "20"}`,
                marginTop: "8px",
              }}
            />
            {errors.email && <p style={{ color: "#ef4444" }}>{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label style={{ fontWeight: 600, color: text_color }}>{config.password_label}</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "14px",
                  paddingRight: "48px",
                  borderRadius: "12px",
                  border: `2px solid ${errors.password ? "#ef4444" : text_color + "20"}`,
                  marginTop: "8px",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {formData.password && (
              <div style={{ marginTop: "8px" }}>
                <div
                  style={{
                    width: "100%",
                    height: "6px",
                    backgroundColor: text_color + "15",
                    borderRadius: "3px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${passwordStrength}%`,
                      height: "100%",
                      backgroundColor: getStrengthColor(passwordStrength),
                    }}
                  />
                </div>
                <p style={{ color: getStrengthColor(passwordStrength) }}>
                  {getStrengthText(passwordStrength)}
                </p>
              </div>
            )}
            {errors.password && <p style={{ color: "#ef4444" }}>{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label style={{ fontWeight: 600, color: text_color }}>{config.confirm_password_label}</label>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="••••••••"
                style={{
                  width: "100%",
                  padding: "14px",
                  paddingRight: "48px",
                  borderRadius: "12px",
                  border: `2px solid ${errors.confirmPassword ? "#ef4444" : text_color + "20"}`,
                  marginTop: "8px",
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                }}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>
            {errors.confirmPassword && <p style={{ color: "#ef4444" }}>{errors.confirmPassword}</p>}
          </div>

          {/* Sign Up Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "16px",
              fontSize: `${font_size * 1.125}px`,
              fontWeight: 700,
              color: "white",
              background: `linear-gradient(135deg, ${primary_color}, ${secondary_color})`,
              border: "none",
              borderRadius: "12px",
              cursor: isLoading ? "not-allowed" : "pointer",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? "Creating account..." : config.signup_button}
          </motion.button>

          <p style={{ textAlign: "center", color: text_color, marginTop: "12px" }}>
            {config.login_text}{" "}
            <span
              onClick={() => navigate("/login")}
              style={{
                color: primary_color,
                fontWeight: 600,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              {config.login_link}
            </span>
          </p>
        </form>
      </motion.div>
    </motion.div>
  );
}

export default SignUp;
