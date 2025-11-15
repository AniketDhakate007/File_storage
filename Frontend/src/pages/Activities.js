import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Activities = () => {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  // Gradient colors (blue-purple)
  const primaryGradient = "from-blue-500 via-indigo-500 to-purple-600";

  const activityAPI = "/api/user/activity";

  const fetchActivities = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(activityAPI);
      if (!response.ok) throw new Error("Failed to fetch activity data");
      const data = await response.json();
      setActivities(data.activities || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A";
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const filteredAndSorted = useMemo(() => {
    let filtered = [...activities];

    if (dateFrom) {
      filtered = filtered.filter(
        (a) => new Date(a.timestamp) >= new Date(dateFrom)
      );
    }
    if (dateTo) {
      const end = new Date(dateTo);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(
        (a) => new Date(a.timestamp) <= new Date(end)
      );
    }

    if (actionFilter !== "all") {
      filtered = filtered.filter(
        (a) => a.action?.toLowerCase() === actionFilter.toLowerCase()
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === "date-desc")
        return new Date(b.timestamp) - new Date(a.timestamp);
      if (sortBy === "date-asc")
        return new Date(a.timestamp) - new Date(b.timestamp);
      if (sortBy === "name-asc")
        return (a.fileName || "").localeCompare(b.fileName || "");
      if (sortBy === "name-desc")
        return (b.fileName || "").localeCompare(a.fileName || "");
      return 0;
    });

    return filtered;
  }, [activities, dateFrom, dateTo, actionFilter, sortBy]);

  const stats = useMemo(() => {
    return {
      total: filteredAndSorted.length,
      uploads: filteredAndSorted.filter((a) => a.action === "upload").length,
      downloads: filteredAndSorted.filter((a) => a.action === "download")
        .length,
      deletes: filteredAndSorted.filter((a) => a.action === "delete").length,
    };
  }, [filteredAndSorted]);

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center h-screen text-gray-600"
      >
        <div className="animate-spin border-4 border-indigo-500 border-t-transparent rounded-full w-12 h-12 mb-3" />
        <p className="text-lg font-semibold">Loading activity history...</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center justify-center h-screen text-red-600"
      >
        <h2 className="text-2xl font-bold mb-2">Error</h2>
        <p className="mb-4">{error}</p>
        <button
          onClick={fetchActivities}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Retry
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="p-6 min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 font-inter relative overflow-hidden"
    >
      {/* Floating Icons */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 left-8 text-[80px] opacity-10 select-none"
      >
        ☁️
      </motion.div>
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-10 text-[100px] opacity-10 select-none"
      >
        📁
      </motion.div>
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-12 text-[60px] opacity-10 select-none"
      >
        🔒
      </motion.div>

      {/* 🏠 Home & 🔙 Back Buttons */}
      <div className="absolute top-5 left-5 flex gap-3 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="bg-white border-2 border-indigo-500 text-indigo-600 px-4 py-2 rounded-lg font-semibold shadow hover:bg-indigo-50"
        >
          🔙 Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:opacity-90"
        >
          🏠 Home
        </motion.button>
      </div>

      {/* Header */}
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="flex justify-between flex-wrap gap-3 mb-8 mt-14"
      >
        <div>
          <h1 className="text-4xl font-extrabold text-gray-800">
            File Activities
          </h1>
          <p className="text-gray-500">Track all your cloud operations ☁️</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchActivities}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-2 rounded-lg font-semibold shadow hover:opacity-90"
        >
          🔄 Refresh
        </motion.button>
      </motion.header>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="grid md:grid-cols-4 sm:grid-cols-2 gap-6 mb-8"
      >
        {[
          {
            title: "Total Activities",
            value: stats.total,
            gradient: "from-blue-500 to-indigo-600",
          },
          {
            title: "Uploads",
            value: stats.uploads,
            gradient: "from-indigo-400 to-blue-600",
          },
          {
            title: "Downloads",
            value: stats.downloads,
            gradient: "from-green-400 to-green-600",
          },
          {
            title: "Deletes",
            value: stats.deletes,
            gradient: "from-red-400 to-pink-500",
          },
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true }}
            className={`bg-gradient-to-r ${card.gradient} text-white p-5 rounded-xl shadow-lg`}
          >
            <p className="text-sm opacity-90">{card.title}</p>
            <h2 className="text-3xl font-bold">{card.value}</h2>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-white shadow-lg rounded-xl p-5 mb-8 border border-gray-100"
      >
        <h3 className="text-lg font-semibold text-gray-700 mb-3">
          🔍 Filters
        </h3>
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">From Date</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">To Date</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Action</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-indigo-400 outline-none"
            >
              <option value="all">All</option>
              <option value="upload">Upload</option>
              <option value="download">Download</option>
              <option value="delete">Delete</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border rounded-md p-2 mt-1 focus:ring-2 focus:ring-indigo-400 outline-none"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="name-asc">Name A–Z</option>
              <option value="name-desc">Name Z–A</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Activity Table */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-white shadow-lg rounded-xl p-5 overflow-x-auto border border-gray-100"
      >
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-100 to-purple-100 text-gray-700">
              <th className="p-3">File Name</th>
              <th className="p-3">Action</th>
              <th className="p-3">Date & Time</th>
              <th className="p-3">File Size</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.length > 0 ? (
              filteredAndSorted.map((activity, idx) => (
                <motion.tr
                  key={idx}
                  whileHover={{ backgroundColor: "#f9fafb" }}
                  transition={{ duration: 0.2 }}
                  className="border-t"
                >
                  <td className="p-3">{activity.fileName || "N/A"}</td>
                  <td className="p-3 capitalize">{activity.action}</td>
                  <td className="p-3">{formatDate(activity.timestamp)}</td>
                  <td className="p-3">{formatFileSize(activity.size)}</td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-gray-500 p-4">
                  No activities found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
};

export default Activities;
