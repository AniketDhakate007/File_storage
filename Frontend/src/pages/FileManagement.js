import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./FileManagement.css";

const defaultConfig = {
  page_title: "File Management",
  page_subtitle: "Manage your uploaded files",
  back_button: "← Back",
  home_button: "🏠 Home",
  search_placeholder: "Search files...",
  download_button: "Download",
  delete_button: "Delete",
  list_api: "/api/list-files",
  download_api: "/api/download-file",
  delete_api: "/api/delete-file",
  primary_color: "#6366f1",
  secondary_color: "#8b5cf6",
  background_color: "#eef2ff",
  surface_color: "#ffffff",
  text_color: "#1e293b",
  font_family: "Inter",
};

export default function FileManagement() {
  const [config] = useState(defaultConfig);
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    setFilteredFiles(
      files.filter((file) =>
        file.fileName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, files]);

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(config.list_api);
      if (!response.ok) throw new Error("Failed to fetch files");
      const data = await response.json();
      setFiles(data.files || []);
      setFilteredFiles(data.files || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (file) => {
    try {
      const res = await fetch(
        `${config.download_api}?filename=${encodeURIComponent(file.fileName)}`
      );
      const data = await res.json();
      const link = document.createElement("a");
      link.href = data.downloadUrl;
      link.download = file.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      alert("Download failed");
    }
  };

  const handleDelete = async (file) => {
    try {
      const res = await fetch(
        `${config.delete_api}?filename=${encodeURIComponent(file.fileName)}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        setFiles((prev) => prev.filter((f) => f.fileName !== file.fileName));
      }
      setConfirmDeleteId(null);
    } catch {
      alert("Delete failed");
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 Bytes";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleString() : "Unknown";

  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    const icons = {
      pdf: "📄",
      docx: "📝",
      xlsx: "📊",
      pptx: "📽️",
      jpg: "🖼️",
      png: "🖼️",
      gif: "🖼️",
      zip: "📦",
      mp4: "🎥",
      mp3: "🎵",
      txt: "📃",
    };
    return icons[ext] || "📁";
  };

  // Loading Screen
  if (isLoading)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 text-gray-600"
      >
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg font-semibold">Loading files...</p>
      </motion.div>
    );

  // Error Screen
  if (error)
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-screen bg-red-50"
      >
        <h2 className="text-2xl text-red-600 font-bold mb-2">
          Error Loading Files
        </h2>
        <p className="mb-4">{error}</p>
        <button
          onClick={fetchFiles}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600"
        >
          Try Again
        </button>
      </motion.div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 overflow-hidden"
      style={{ fontFamily: config.font_family }}
    >
      {/* Floating Icons */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-16 left-10 text-[80px] opacity-10"
      >
        ☁️
      </motion.div>
      <motion.div
        animate={{ y: [0, 25, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-10 text-[100px] opacity-10"
      >
        📁
      </motion.div>

      {/* 🏠 Back & Home Buttons */}
      <div className="absolute top-5 left-5 flex gap-3 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="bg-white border-2 border-indigo-500 text-indigo-600 px-4 py-2 rounded-lg font-semibold shadow hover:bg-indigo-50"
        >
          ← Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:opacity-90"
        >
          🏠 Home
        </motion.button>
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="flex flex-wrap justify-between items-center mb-8 mt-16"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {config.page_title}
          </h1>
          <p className="text-gray-600">{config.page_subtitle}</p>
        </div>
      </motion.header>

      {/* Search */}
      <motion.input
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        type="text"
        placeholder={config.search_placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-3 mb-8 border rounded-lg shadow focus:ring-2 focus:ring-indigo-400 outline-none"
      />

      {/* Files Grid */}
      {filteredFiles.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 bg-white rounded-lg shadow-md"
        >
          <div className="text-5xl mb-4">📭</div>
          <h2 className="text-xl font-semibold text-gray-800">
            No Files Found
          </h2>
          <p className="text-gray-500">
            {searchQuery
              ? "Try a different search query."
              : "Upload files to see them here."}
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
        >
          {filteredFiles.map((file, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.04 }}
              className="bg-white rounded-xl shadow p-5 hover:shadow-xl transition-all"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="text-4xl">{getFileIcon(file.fileName)}</div>
                <div className="truncate">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {file.fileName}
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {formatFileSize(file.fileSize)}
                  </p>
                </div>
              </div>
              <div className="text-sm text-gray-500 mb-4">
                Uploaded: {formatDate(file.uploadDate)}
              </div>

              {confirmDeleteId === file.fileName ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-2"
                >
                  <p className="text-red-500 font-semibold text-sm text-center">
                    Confirm delete?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(file)}
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg"
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg"
                    >
                      No
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDownload(file)}
                    className="flex-1 bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600"
                  >
                    {config.download_button}
                  </button>
                  <button
                    onClick={() => setConfirmDeleteId(file.fileName)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                  >
                    {config.delete_button}
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
