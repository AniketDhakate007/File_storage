import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const defaultConfig = {
  error_404_title: "Page Not Found",
  error_404_message: "The page you're looking for doesn't exist or has been moved.",
  error_403_title: "Access Denied",
  error_403_message: "You don't have permission to access this resource.",
  error_500_title: "Server Error",
  error_500_message: "Something went wrong on our end. Please try again later.",
  home_button: "Go to Home Page",
  dashboard_button: "Go to Dashboard",
  login_button: "Login Again",
  back_button: "Go Back",
  contact_button: "Contact Support",
  route_label: "Requested URL:",
  background_color: "#eef2ff",
  surface_color: "#ffffff",
  text_color: "#1e293b",
  primary_color: "#6366f1",
  secondary_color: "#8b5cf6",
  font_family: "Inter",
  font_size: 16,
};

const ErrorPage = ({
  errorCode = "404",
  errorMessage = null,
  requestedRoute = null,
  userRole = "user",
  onNavigate = null,
}) => {
  const [config] = useState(defaultConfig);
  const [currentError, setCurrentError] = useState(errorCode);
  const navigate = useNavigate();

  const primaryColor = config.primary_color;
  const secondaryColor = config.secondary_color;
  const backgroundColor = config.background_color;
  const surfaceColor = config.surface_color;
  const textColor = config.text_color;
  const fontSize = config.font_size;
  const fontFamily = config.font_family;

  const getErrorDetails = () => {
    switch (currentError) {
      case "404":
        return {
          code: "404",
          title: config.error_404_title,
          message: errorMessage || config.error_404_message,
          icon: "🔍",
          gradient: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
        };
      case "403":
        return {
          code: "403",
          title: config.error_403_title,
          message: errorMessage || config.error_403_message,
          icon: "🔒",
          gradient: "linear-gradient(135deg, #ef4444, #dc2626)",
        };
      case "500":
        return {
          code: "500",
          title: config.error_500_title,
          message: errorMessage || config.error_500_message,
          icon: "⚠️",
          gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
        };
      default:
        return {
          code: currentError,
          title: "Error",
          message: errorMessage || "An unexpected error occurred.",
          icon: "❌",
          gradient: `linear-gradient(135deg, ${textColor}, ${textColor})`,
        };
    }
  };

  const handleNavigation = (destination) => {
    if (onNavigate) onNavigate(destination);
    else navigate(`/${destination}`);
  };

  const handleGoHome = () => handleNavigation("");
  const handleGoDashboard = () => handleNavigation("dashboard");
  const handleLogin = () => handleNavigation("login");
  const handleGoBack = () => window.history.back();
  const handleContactSupport = () => handleNavigation("support");

  const getActionButtons = () => {
    const buttons = [];
    if (currentError === "403") {
      if (userRole === "admin") {
        buttons.push({ label: config.dashboard_button, onClick: handleGoDashboard, primary: true });
      } else {
        buttons.push({ label: config.login_button, onClick: handleLogin, primary: true });
        buttons.push({ label: config.home_button, onClick: handleGoHome, primary: false });
      }
    } else if (currentError === "404") {
      buttons.push({ label: config.home_button, onClick: handleGoHome, primary: true });
      buttons.push({ label: config.back_button, onClick: handleGoBack, primary: false });
    } else if (currentError === "500") {
      buttons.push({ label: config.home_button, onClick: handleGoHome, primary: true });
      buttons.push({ label: config.contact_button, onClick: handleContactSupport, primary: false });
    } else {
      buttons.push({ label: config.home_button, onClick: handleGoHome, primary: true });
    }
    return buttons;
  };

  const errorDetails = getErrorDetails();
  const actionButtons = getActionButtons();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      style={{
        minHeight: "100vh",
        background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor}, #7dd3fc)`,
        fontFamily,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "24px",
      }}
    >
      {/* 🌥️ Floating Icons */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "15%",
          left: "10%",
          fontSize: "80px",
          opacity: 0.12,
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
        ⚠️
      </motion.div>

      {/* 🏠 Top Buttons */}
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          display: "flex",
          gap: "10px",
          zIndex: 10,
        }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoBack}
          style={{
            background: "white",
            color: primaryColor,
            border: `2px solid ${primaryColor}`,
            padding: "8px 16px",
            borderRadius: "10px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          🔙 Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleGoHome}
          style={{
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            color: "white",
            border: "none",
            padding: "8px 16px",
            borderRadius: "10px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          🏠 Home
        </motion.button>
      </div>

      {/* Error Switch Buttons (Top Right) */}
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          display: "flex",
          gap: 8,
        }}
      >
        {["404", "403", "500"].map((type) => (
          <motion.button
            whileHover={{ scale: 1.1 }}
            key={type}
            onClick={() => setCurrentError(type)}
            style={{
              padding: "8px 16px",
              backgroundColor: currentError === type ? primaryColor : surfaceColor,
              color: currentError === type ? "white" : textColor,
              border: `2px solid ${primaryColor}`,
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            {type}
          </motion.button>
        ))}
      </div>

      {/* 💥 Animated Error Section */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentError}
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -30 }}
          transition={{ duration: 0.7 }}
          style={{
            textAlign: "center",
            backgroundColor: surfaceColor,
            padding: "40px",
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            maxWidth: "600px",
            zIndex: 5,
          }}
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            style={{ fontSize: "80px", marginBottom: "16px" }}
          >
            {errorDetails.icon}
          </motion.div>

          <motion.h1
            style={{
              fontSize: "5rem",
              fontWeight: 900,
              background: errorDetails.gradient,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {errorDetails.code}
          </motion.h1>

          <h2 style={{ fontSize: "1.8rem", color: textColor, fontWeight: 700 }}>
            {errorDetails.title}
          </h2>
          <p
            style={{
              color: textColor,
              opacity: 0.8,
              fontSize: "1.1rem",
              marginTop: "10px",
            }}
          >
            {errorDetails.message}
          </p>

          {requestedRoute && (
            <div
              style={{
                marginTop: "20px",
                background: "#f1f5f9",
                padding: "10px 16px",
                borderRadius: "8px",
                color: textColor,
              }}
            >
              <strong>{config.route_label}</strong> {requestedRoute}
            </div>
          )}

          {/* Action Buttons */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "30px",
            }}
          >
            {actionButtons.map((btn, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={btn.onClick}
                style={{
                  padding: "12px 24px",
                  borderRadius: 8,
                  border: btn.primary ? "none" : `2px solid ${primaryColor}`,
                  background: btn.primary
                    ? `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                    : "white",
                  color: btn.primary ? "white" : textColor,
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                {btn.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <footer
        style={{
          position: "absolute",
          bottom: 20,
          color: "white",
          fontWeight: 500,
          opacity: 0.8,
        }}
      >
        © 2025 CloudSafe — All Rights Reserved
      </footer>
    </motion.div>
  );
};

export default ErrorPage;
