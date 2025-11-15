// src/pages/About.js
import React from "react";
import { motion } from "framer-motion";

function About() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 24px",
        fontFamily: "Inter, sans-serif",
        position: "relative",
        overflow: "hidden", // important for floating icons
      }}
    >
      {/* 🌤️ Floating Animated Icons */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "10%",
          left: "12%",
          fontSize: "70px",
          opacity: 0.1,
          pointerEvents: "none",
        }}
      >
        ☁️
      </motion.div>

      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "40%",
          right: "10%",
          fontSize: "80px",
          opacity: 0.1,
          pointerEvents: "none",
        }}
      >
        🔐
      </motion.div>

      <motion.div
        animate={{ y: [0, -25, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          bottom: "15%",
          left: "20%",
          fontSize: "75px",
          opacity: 0.1,
          pointerEvents: "none",
        }}
      >
        📁
      </motion.div>

      {/* ✨ Animated Heading */}
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{ fontSize: "2.8rem", fontWeight: 800, marginBottom: "20px" }}
      >
        About <span style={{ color: "#e0e7ff" }}>CloudSafe</span>
      </motion.h1>

      {/* 🧾 Animated Description */}
      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        style={{
          maxWidth: "800px",
          textAlign: "center",
          fontSize: "1.2rem",
          lineHeight: "1.8",
          opacity: 0.95,
          marginBottom: "60px",
        }}
      >
        CloudSafe is designed to provide secure, fast, and easy access to your
        files — anytime, anywhere. Whether you're uploading critical documents
        or collaborating with your team, we ensure top-level reliability,
        privacy, and smooth performance.
      </motion.p>

      {/* 💫 Animated Mission Card */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
        whileHover={{ scale: 1.03 }}
        style={{
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: "16px",
          padding: "30px 40px",
          maxWidth: "700px",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
          textAlign: "center",
          backdropFilter: "blur(10px)",
        }}
      >
        <h2
          style={{
            fontSize: "1.8rem",
            marginBottom: "16px",
            fontWeight: 700,
            color: "#f8fafc",
          }}
        >
          Our Mission
        </h2>
        <p style={{ lineHeight: "1.7", fontSize: "1.05rem", opacity: 0.9 }}>
          To empower individuals and organizations with seamless cloud-based
          file management solutions that prioritize simplicity, scalability, and
          rock-solid security — ensuring data safety and accessibility for
          everyone.
        </p>
      </motion.div>
    </div>
  );
}

export default About;
