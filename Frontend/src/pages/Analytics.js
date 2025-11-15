import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const defaultConfig = {
  page_title: "Analytics Dashboard",
  page_subtitle: "Monitor your cloud storage metrics in real-time ☁️",
  refresh_button: "🔄 Refresh Data",
  back_button: "← Back",
  home_button: "🏠 Home",
  logout_button: "Logout",
  storage_label: "Total Storage",
  files_label: "Total Files",
  downloads_label: "Total Downloads",
  users_label: "Active Users",
  trend_chart_title: "📈 Upload & Download Trends",
  storage_chart_title: "💾 Storage by File Type",
  analytics_api: "/api/analytics",
  background_color: "#eef2ff",
  surface_color: "#ffffff",
  text_color: "#1e293b",
  primary_color: "#6366f1",
  secondary_color: "#8b5cf6",
  font_family: "Inter",
  font_size: 16,
};

const Analytics = () => {
  const navigate = useNavigate();
  const [config] = useState(defaultConfig);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const trendChartRef = useRef(null);
  const storageChartRef = useRef(null);
  const trendChartInstance = useRef(null);
  const storageChartInstance = useRef(null);

  const {
    primary_color,
    secondary_color,
    background_color,
    surface_color,
    text_color,
    font_size,
    font_family,
  } = config;

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (analyticsData) renderCharts();
    return () => {
      if (trendChartInstance.current) trendChartInstance.current.destroy();
      if (storageChartInstance.current) storageChartInstance.current.destroy();
    };
  }, [analyticsData]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(config.analytics_api);
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      setAnalyticsData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCharts = () => {
    if (!analyticsData) return;

    // Destroy old charts
    if (trendChartInstance.current) trendChartInstance.current.destroy();
    if (storageChartInstance.current) storageChartInstance.current.destroy();

    const trendCtx = trendChartRef.current.getContext("2d");
    trendChartInstance.current = new Chart(trendCtx, {
      type: "line",
      data: {
        labels: analyticsData.uploadTrend.map((item) =>
          new Date(item.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        ),
        datasets: [
          {
            label: "Uploads",
            data: analyticsData.uploadTrend.map((i) => i.uploads),
            borderColor: primary_color,
            backgroundColor: `${primary_color}33`,
            tension: 0.4,
            fill: true,
          },
          {
            label: "Downloads",
            data: analyticsData.uploadTrend.map((i) => i.downloads),
            borderColor: secondary_color,
            backgroundColor: `${secondary_color}33`,
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { labels: { color: text_color } } },
        scales: {
          x: { ticks: { color: text_color } },
          y: { ticks: { color: text_color }, beginAtZero: true },
        },
      },
    });

    const storageCtx = storageChartRef.current.getContext("2d");
    storageChartInstance.current = new Chart(storageCtx, {
      type: "pie",
      data: {
        labels: analyticsData.storageByType.map((i) => i.type),
        datasets: [
          {
            data: analyticsData.storageByType.map((i) => i.size),
            backgroundColor: [
              primary_color,
              secondary_color,
              "#10b981",
              "#f59e0b",
              "#ef4444",
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: "bottom", labels: { color: text_color } },
        },
      },
    });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 MB";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
  };

  // ⏳ Loading State
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100"
      >
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 text-lg font-semibold">
          Fetching Analytics...
        </p>
      </motion.div>
    );
  }

  // ❌ Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-50">
        <h2 className="text-2xl text-red-600 font-bold mb-4">
          Error Loading Analytics
        </h2>
        <p className="text-gray-700 mb-4">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen p-8 bg-gradient-to-br from-indigo-100 via-purple-100 to-blue-100 overflow-hidden font-inter"
    >
      {/* Floating Background Icons */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-16 left-10 text-[80px] opacity-10 select-none"
      >
        ☁️
      </motion.div>
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-12 right-10 text-[100px] opacity-10 select-none"
      >
        📊
      </motion.div>
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-12 text-[60px] opacity-10 select-none"
      >
        🔒
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
        transition={{ duration: 0.8 }}
        className="flex flex-wrap justify-between items-center mb-10 mt-16"
      >
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800">
            {config.page_title}
          </h1>
          <p className="text-gray-600">{config.page_subtitle}</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchAnalytics}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-5 py-2 rounded-lg shadow hover:opacity-90"
          >
            {config.refresh_button}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-red-100 text-red-600 px-5 py-2 rounded-lg hover:bg-red-200 transition"
          >
            {config.logout_button}
          </motion.button>
        </div>
      </motion.header>

      {/* Metric Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
      >
        {[
          {
            title: config.storage_label,
            value: formatFileSize(analyticsData.totalStorageUsed * 1024 * 1024),
            gradient: "from-indigo-500 to-blue-500",
          },
          {
            title: config.files_label,
            value: analyticsData.totalFiles,
            gradient: "from-green-400 to-green-600",
          },
          {
            title: config.downloads_label,
            value: analyticsData.totalDownloads,
            gradient: "from-yellow-400 to-orange-500",
          },
          {
            title: config.users_label,
            value: analyticsData.activeUsers,
            gradient: "from-purple-500 to-pink-500",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.6 }}
            viewport={{ once: true }}
            className={`bg-gradient-to-r ${card.gradient} text-white rounded-xl p-6 shadow-lg`}
          >
            <p className="text-sm opacity-80 mb-2">{card.title}</p>
            <h2 className="text-3xl font-bold">{card.value}</h2>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        <div
          className="p-6 rounded-xl shadow-lg border border-gray-100"
          style={{ backgroundColor: surface_color }}
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            {config.trend_chart_title}
          </h3>
          <canvas ref={trendChartRef}></canvas>
        </div>

        <div
          className="p-6 rounded-xl shadow-lg border border-gray-100"
          style={{ backgroundColor: surface_color }}
        >
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            {config.storage_chart_title}
          </h3>
          <canvas ref={storageChartRef}></canvas>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Analytics;
