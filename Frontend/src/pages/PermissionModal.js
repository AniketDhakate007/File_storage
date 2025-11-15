// src/pages/PermissionModal.js
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function PermissionModal({ file, onClose }) {
  const [email, setEmail] = useState("");
  const [permissions, setPermissions] = useState({
    create: false,
    read: true,
    update: false,
    delete: false,
  });

  const handleToggle = (perm) =>
    setPermissions((prev) => ({ ...prev, [perm]: !prev[perm] }));

  const handleSave = async () => {
    try {
      const res = await fetch("/api/permissions/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileId: file.id,
          sharedWith: email,
          permissions,
        }),
      });
      if (!res.ok) throw new Error("Failed to save permission");
      alert("✅ Permission granted successfully!");
      onClose();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-2xl p-8 w-[90%] max-w-md text-center relative"
      >
        {/* Gradient Header */}
        <div className="absolute inset-x-0 top-0 h-2 rounded-t-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500"></div>

        <h2 className="text-2xl font-bold text-gray-800 mt-4 mb-2">
          Share File Access 🔐
        </h2>
        <p className="text-gray-500 mb-6 text-sm">
          Set permissions for <strong>{file.name}</strong>
        </p>

        {/* Email Input */}
        <div className="text-left mb-4">
          <label className="text-sm font-semibold text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter user email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 mt-1 focus:ring-2 focus:ring-indigo-400 outline-none"
          />
        </div>

        {/* Permission Toggles */}
        <div className="grid grid-cols-2 gap-3 text-left mb-6">
          {["create", "read", "update", "delete"].map((perm) => (
            <label
              key={perm}
              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
            >
              <input
                type="checkbox"
                checked={permissions[perm]}
                onChange={() => handleToggle(perm)}
                className="accent-indigo-500 scale-110"
              />
              <span className="capitalize text-gray-700">{perm}</span>
            </label>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Cancel
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="px-5 py-2 text-white rounded-lg font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 shadow-md hover:opacity-90 transition"
          >
            Save
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
