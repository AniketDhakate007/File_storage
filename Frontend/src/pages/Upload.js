// src/pages/Upload.js
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const defaultConfig = {
  page_title: "Upload Files",
  page_subtitle: "Drag and drop files or click to browse",
  upload_button: "Upload Files",
  back_button: "← Back to Dashboard",
  drop_zone_text: "Drop files here",
  browse_text: "or click to browse",
  api_endpoint: "/api/generate-presigned-url",
  primary_color: "#6366f1", // Indigo
  secondary_color: "#8b5cf6", // Purple
  background_color: "#eef2ff", // Light indigo
  surface_color: "#ffffff",
  text_color: "#1e293b",
  font_family: "Inter",
  font_size: 16,
};

function UploadPage() {
  const navigate = useNavigate();
  const [config] = useState(defaultConfig);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const {
    primary_color,
    secondary_color,
    background_color,
    surface_color,
    text_color,
    font_family,
  } = config;

  useEffect(() => {
    document.body.style.background = `linear-gradient(135deg, ${primary_color}, ${secondary_color}, #7dd3fc)`;
    document.body.style.fontFamily = `${font_family}, sans-serif`;
  }, [primary_color, secondary_color, font_family]);

  const handleFileSelect = (files) => {
    const validFiles = Array.from(files).filter(
      (f) => f.size <= 100 * 1024 * 1024
    );
    const withIds = validFiles.map((f) => ({
      id: Math.random().toString(36).substr(2, 9),
      file: f,
      name: f.name,
      size: f.size,
    }));
    setSelectedFiles((prev) => [...prev, ...withIds]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFile = (id) =>
    setSelectedFiles((prev) => prev.filter((f) => f.id !== id));

  const formatSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
  };

  const handleUpload = async () => {
    alert("Simulating upload... (Connect API for real upload)");
  };

  const handleHome = () => navigate("/");
  const handleBack = () => navigate(-1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        minHeight: "100vh",
        padding: "32px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ☁️ Floating Icons */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "10%",
          left: "6%",
          fontSize: "90px",
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
          right: "8%",
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
          top: "60%",
          left: "15%",
          fontSize: "70px",
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

      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        style={{
          textAlign: "center",
          marginTop: "80px",
          color: text_color,
        }}
      >
        <h1 style={{ fontSize: "2.5rem", fontWeight: "700" }}>
          {config.page_title}
        </h1>
        <p style={{ opacity: 0.7 }}>{config.page_subtitle}</p>
      </motion.div>

      {/* Drop Zone */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
        whileHover={{ scale: 1.02 }}
        animate={{
          boxShadow: isDragging
            ? `0 0 25px ${primary_color}50`
            : "0 10px 30px rgba(0,0,0,0.1)",
        }}
        transition={{ duration: 0.3 }}
        style={{
          margin: "50px auto",
          maxWidth: "700px",
          backgroundColor: surface_color,
          border: `3px dashed ${
            isDragging ? primary_color : text_color + "30"
          }`,
          borderRadius: "24px",
          padding: "60px 40px",
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          style={{
            fontSize: "80px",
            color: primary_color,
            marginBottom: "16px",
          }}
        >
          ☁️
        </motion.div>
        <h2 style={{ color: primary_color, fontWeight: 600 }}>
          {config.drop_zone_text}
        </h2>
        <p style={{ color: text_color, opacity: 0.7 }}>{config.browse_text}</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => handleFileSelect(e.target.files)}
          style={{ display: "none" }}
        />
      </motion.div>

      {/* Selected Files */}
      <AnimatePresence>
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.5 }}
            style={{
              maxWidth: "700px",
              margin: "0 auto",
              backgroundColor: surface_color,
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
            }}
          >
            <h3 style={{ color: text_color, fontWeight: "600" }}>
              Selected Files ({selectedFiles.length})
            </h3>

            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: `0 10px 25px ${primary_color}60`,
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleUpload}
              disabled={isUploading}
              style={{
                background: `linear-gradient(135deg, ${primary_color}, ${secondary_color})`,
                color: "white",
                border: "none",
                borderRadius: "12px",
                padding: "12px 24px",
                marginTop: "12px",
                cursor: isUploading ? "not-allowed" : "pointer",
                fontWeight: 600,
              }}
            >
              {isUploading ? "Uploading..." : config.upload_button}
            </motion.button>

            <ul style={{ marginTop: "20px", listStyle: "none", padding: 0 }}>
              {selectedFiles.map((file) => (
                <motion.li
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    marginBottom: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#f9fafb",
                    borderRadius: "10px",
                    padding: "10px 16px",
                  }}
                >
                  <div>
                    📄 <strong>{file.name}</strong> — {formatSize(file.size)}
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    style={{
                      backgroundColor: "#fee2e2",
                      border: "none",
                      borderRadius: "8px",
                      color: "#dc2626",
                      padding: "4px 10px",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    ✖ Remove
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default UploadPage;
