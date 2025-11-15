// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import {
  S3Client,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PermissionModal from "./PermissionModal"; // 👈 import modal here

const region = process.env.REACT_APP_AWS_REGION || "us-east-1";
const IDENTITY_POOL_ID = process.env.REACT_APP_IDENTITY_POOL_ID || "";
const DDB_TABLE = process.env.REACT_APP_DYNAMODB_TABLE || "";
const S3_BUCKET = process.env.REACT_APP_S3_BUCKET || "";

// Toast message
function toast(msg, color = "#10b981") {
  const t = document.createElement("div");
  t.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${color};
    color: white;
    padding: 12px 18px;
    border-radius: 8px;
    z-index: 9999;
    font-weight: 600;
  `;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [ddbItems, setDdbItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [clientsReady, setClientsReady] = useState(false);
  const [s3Client, setS3Client] = useState(null);
  const [ddbDocClient, setDdbDocClient] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // 👈 for modal

  const primary = "#6366f1"; // indigo
  const secondary = "#8b5cf6"; // purple
  const accent = "#38bdf8"; // sky blue

  // AWS initialization
  useEffect(() => {
    const initClients = async () => {
      try {
        const credsProvider = fromCognitoIdentityPool({
          clientConfig: { region },
          identityPoolId: IDENTITY_POOL_ID,
        });

        const s3 = new S3Client({ region, credentials: credsProvider });
        const ddb = new DynamoDBClient({ region, credentials: credsProvider });
        const ddbDoc = DynamoDBDocumentClient.from(ddb);
        setS3Client(s3);
        setDdbDocClient(ddbDoc);
        setClientsReady(true);
      } catch {
        toast("AWS initialization failed", "#ef4444");
      }
    };
    initClients();
  }, []);

  useEffect(() => {
    if (clientsReady) fetchFiles();
  }, [clientsReady]);

  const fetchFiles = async () => {
    if (!ddbDocClient) return;
    setLoading(true);
    try {
      const cmd = new ScanCommand({ TableName: DDB_TABLE });
      const res = await ddbDocClient.send(cmd);
      setDdbItems(res.Items || []);
    } catch {
      toast("Error fetching files", "#ef4444");
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (item) => {
    if (!window.confirm(`Delete "${item.name || item.s3Key}" permanently?`))
      return;
    try {
      await s3Client.send(
        new DeleteObjectCommand({ Bucket: S3_BUCKET, Key: item.s3Key })
      );
      await ddbDocClient.send(
        new DeleteCommand({ TableName: DDB_TABLE, Key: { id: item.id } })
      );
      toast("File deleted successfully", "#10b981");
      fetchFiles();
    } catch {
      toast("Failed to delete file", "#ef4444");
    }
  };

  const openFile = async (item) => {
    try {
      const url = await getSignedUrl(
        s3Client,
        new GetObjectCommand({ Bucket: S3_BUCKET, Key: item.s3Key }),
        { expiresIn: 900 }
      );
      window.open(url, "_blank");
    } catch {
      toast("Cannot open file. Check permissions.", "#ef4444");
    }
  };

  const filtered = ddbItems.filter((f) =>
    (f.name || f.s3Key || "")
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: `linear-gradient(135deg, ${primary}, ${secondary}, ${accent})`,
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
        padding: "24px",
      }}
    >
      {/* Floating icons */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
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
        transition={{ duration: 8, repeat: Infinity }}
        style={{
          position: "absolute",
          bottom: "15%",
          right: "8%",
          fontSize: "100px",
          opacity: 0.1,
        }}
      >
        📁
      </motion.div>
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        style={{
          position: "absolute",
          top: "70%",
          left: "10%",
          fontSize: "60px",
          opacity: 0.1,
        }}
      >
        🔒
      </motion.div>

      {/* Home + Back buttons */}
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
          onClick={() => navigate(-1)}
          style={{
            background: "white",
            border: `2px solid ${primary}`,
            color: primary,
            fontWeight: 600,
            borderRadius: "8px",
            padding: "8px 16px",
          }}
        >
          🔙 Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={() => navigate("/")}
          style={{
            background: `linear-gradient(135deg, ${primary}, ${secondary})`,
            border: "none",
            color: "white",
            fontWeight: 600,
            borderRadius: "8px",
            padding: "8px 16px",
          }}
        >
          🏠 Home
        </motion.button>
      </div>

      {/* Main Dashboard Card */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          width: "95%",
          maxWidth: "1100px",
          background: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(16px)",
          borderRadius: "24px",
          padding: "40px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          border: "2px solid rgba(255,255,255,0.3)",
          color: "#fff",
        }}
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: "center",
            fontSize: "2.2rem",
            fontWeight: 800,
            marginBottom: "16px",
          }}
        >
          ☁️ Cloud Dashboard
        </motion.h1>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginBottom: "24px",
          }}
        >
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search files..."
            style={{
              width: "300px",
              padding: "10px 14px",
              borderRadius: "10px",
              border: "none",
              outline: "none",
              fontSize: "1rem",
            }}
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={fetchFiles}
            style={{
              background: `linear-gradient(135deg, ${primary}, ${secondary})`,
              border: "none",
              color: "white",
              borderRadius: "10px",
              padding: "10px 18px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            🔄 Refresh
          </motion.button>
        </div>

        {/* File Table */}
        <div
          style={{
            background: "rgba(255,255,255,0.15)",
            borderRadius: "16px",
            padding: "20px",
            overflowX: "auto",
          }}
        >
          <table
            style={{
              width: "100%",
              color: "#fff",
              borderCollapse: "collapse",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "2px solid rgba(255,255,255,0.2)" }}>
                <th style={{ padding: "12px", textAlign: "left" }}>Name</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Size</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Uploaded</th>
                <th style={{ padding: "12px", textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>
                    Loading files...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "20px" }}>
                    No files found.
                  </td>
                </tr>
              ) : (
                filtered.map((file, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <td style={{ padding: "10px" }}>{file.name || file.s3Key}</td>
                    <td style={{ padding: "10px" }}>{file.size || "--"}</td>
                    <td style={{ padding: "10px" }}>{file.uploadedAt || "--"}</td>
                    <td style={{ padding: "10px", textAlign: "center" }}>
                      <button
                        onClick={() => openFile(file)}
                        style={{
                          margin: "0 6px",
                          padding: "6px 10px",
                          borderRadius: "8px",
                          border: "none",
                          background: "#3b82f6",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => openFile(file)}
                        style={{
                          margin: "0 6px",
                          padding: "6px 10px",
                          borderRadius: "8px",
                          border: "none",
                          background: "#22c55e",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        Download
                      </button>
                      <button
                        onClick={() => deleteFile(file)}
                        style={{
                          margin: "0 6px",
                          padding: "6px 10px",
                          borderRadius: "8px",
                          border: "none",
                          background: "#ef4444",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setSelectedFile(file)} // 👈 open modal
                        style={{
                          margin: "0 6px",
                          padding: "6px 10px",
                          borderRadius: "8px",
                          border: "none",
                          background: "#8b5cf6",
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        🔐 Permissions
                      </button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Permission Modal */}
      {selectedFile && (
        <PermissionModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
        />
      )}
    </motion.div>
  );
}
