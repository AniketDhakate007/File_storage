// src/pages/UserInfo.js
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const UserInfo = () => {
  const [profileData, setProfileData] = useState(null);
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const PROFILE_API = "/api/user/profile";
  const UPDATE_PROFILE_API = "/api/user/update-profile";

  // 🎨 Theme colors
  const primaryColor = "#6366f1"; // Indigo
  const secondaryColor = "#8b5cf6"; // Purple
  const accentColor = "#38bdf8"; // Sky Blue
  const textColor = "#1e293b";

  // 📡 Fetch user profile
  const fetchProfile = async () => {
    try {
      const res = await fetch(PROFILE_API);
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setProfileData(data);
      setFullName(data.fullName || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) return alert("Full name cannot be empty");

    try {
      setIsSaving(true);
      const res = await fetch(UPDATE_PROFILE_API, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName }),
      });
      if (!res.ok) throw new Error("Failed to update profile");
      await res.json();
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleHome = () => navigate("/");
  const handleBack = () => navigate(-1);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen text-white text-xl font-semibold">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen text-red-200 text-xl">
        {error}
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor}, ${accentColor})`,
        fontFamily: "Inter, sans-serif",
        padding: "20px",
      }}
    >
      {/* Floating icons for motion */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "15%",
          left: "8%",
          fontSize: "100px",
          opacity: 0.1,
        }}
      >
        ☁️
      </motion.div>

      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          bottom: "10%",
          right: "10%",
          fontSize: "120px",
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
          top: "70%",
          left: "15%",
          fontSize: "70px",
          opacity: 0.1,
        }}
      >
        🔒
      </motion.div>

      {/* 🏠 Home & Back buttons */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          display: "flex",
          gap: "10px",
          zIndex: 10,
        }}
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          style={{
            background: "#ffffff",
            border: `2px solid ${primaryColor}`,
            borderRadius: "8px",
            padding: "8px 16px",
            cursor: "pointer",
            color: primaryColor,
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
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
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

      {/* Profile Card (Centered) */}
      <motion.div
        initial={{ y: 60, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{
          scale: 1.02,
          boxShadow: `0 0 40px ${accentColor}40`,
        }}
        style={{
          background: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(16px)",
          borderRadius: "24px",
          padding: "50px",
          width: "100%",
          maxWidth: "500px",
          color: "#fff",
          textAlign: "center",
          boxShadow: `0 10px 50px rgba(0,0,0,0.2)`,
          border: "2px solid rgba(255,255,255,0.3)",
        }}
      >
        {/* Profile Avatar */}
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          style={{
            width: "90px",
            height: "90px",
            margin: "0 auto 20px",
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "36px",
            fontWeight: "700",
            color: "white",
            boxShadow: `0 0 30px ${accentColor}40`,
          }}
        >
          {profileData?.fullName?.charAt(0).toUpperCase() || "👤"}
        </motion.div>

        <h2 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "6px" }}>
          {profileData?.fullName || "User"}
        </h2>
        <p style={{ color: "#e5e7eb", marginBottom: "12px" }}>
          {profileData?.email}
        </p>
        <span
          style={{
            display: "inline-block",
            marginBottom: "20px",
            padding: "6px 14px",
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: "20px",
            fontWeight: 600,
          }}
        >
          {profileData?.role || "User"}
        </span>

        {/* Edit Form */}
        <form onSubmit={handleSaveProfile}>
          <div style={{ marginBottom: "16px", textAlign: "left" }}>
            <label style={{ fontWeight: 600 }}>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{
                width: "100%",
                border: "none",
                borderRadius: "10px",
                padding: "12px",
                backgroundColor: "rgba(255,255,255,0.3)",
                color: "#fff",
                fontSize: "1rem",
                outline: "none",
                marginTop: "6px",
              }}
            />
          </div>

          <div style={{ marginBottom: "16px", textAlign: "left" }}>
            <label style={{ fontWeight: 600 }}>Email</label>
            <input
              type="email"
              value={profileData?.email || ""}
              readOnly
              style={{
                width: "100%",
                border: "none",
                borderRadius: "10px",
                padding: "12px",
                backgroundColor: "rgba(255,255,255,0.2)",
                color: "#e2e8f0",
                cursor: "not-allowed",
                fontSize: "1rem",
                marginTop: "6px",
              }}
            />
          </div>

          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: `0 0 30px ${accentColor}80`,
            }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isSaving}
            style={{
              width: "100%",
              padding: "14px",
              border: "none",
              borderRadius: "12px",
              fontWeight: "700",
              color: "white",
              background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`,
              cursor: "pointer",
              opacity: isSaving ? 0.7 : 1,
              fontSize: "1.1rem",
            }}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default UserInfo;
