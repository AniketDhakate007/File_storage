import React, { useEffect, useState } from "react";
import { fetchAuthSession, signOut } from "aws-amplify/auth";

const API_BASE = "https://t7z7i3v7ua.execute-api.eu-north-1.amazonaws.com/prod";

export default function Dashboard({ onLogout }) {
    const [files, setFiles] = useState([]);
    const [role, setRole] = useState(null);
    const [userSub, setUserSub] = useState(null);
    const [file, setFile] = useState(null);
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    // Get token
    const getIdToken = async () => {
        const session = await fetchAuthSession();
        return session.tokens.idToken.toString();
    };

    // Load user session (role + sub)
    const loadSession = async () => {
        try {
            const session = await fetchAuthSession();
            const idToken = session.tokens.idToken.payload;

            const groups = idToken["cognito:groups"] || [];
            const userRole = groups[0] ? groups[0].toLowerCase() : "viewer";

            setRole(userRole);
            setUserSub(idToken["sub"]);
        } catch (err) {
            console.error("Session error:", err);
            onLogout();
        }
    };

    // Fetch file list
    const fetchFiles = async () => {
        try {
            const token = await getIdToken();

            const res = await fetch(`${API_BASE}/files`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            let text = await res.text();
            if (!res.ok) throw new Error(text);

            const fileList = JSON.parse(text);
            setFiles(fileList);
        } catch (err) {
            console.error("Fetch error:", err);
            setMsg("Session expired — please login again.");
            onLogout();
        }
    };

    useEffect(() => {
        loadSession().then(fetchFiles);
    }, []);

    // Upload file
    const uploadFile = async (e) => {
        e.preventDefault();
        if (!file) return;

        setLoading(true);

        try {
            const token = await getIdToken();

            const res = await fetch(`${API_BASE}/upload-url`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fileName: file.name, contentType: file.type }),
            });

            const data = await res.json();

            await fetch(data.uploadUrl, {
                method: "PUT",
                body: file,
            });

            setMsg("Uploaded successfully!");
            fetchFiles();
        } catch (err) {
            console.error("Upload error:", err);
            setMsg("Upload failed.");
        }

        setLoading(false);
    };

    // Download file
    const downloadFile = async (s3Key) => {
        try {
            const token = await getIdToken();
            const res = await fetch(
                `${API_BASE}/download-url?s3Key=${encodeURIComponent(s3Key)}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const data = await res.json();
            window.open(data.downloadUrl, "_blank");
        } catch (err) {
            console.error("Download error:", err);
        }
    };

    // Delete file
    const deleteFile = async (fileId, s3Key) => {
        if (!window.confirm("Delete this file?")) return;

        try {
            const token = await getIdToken();
            await fetch(`${API_BASE}/delete-file`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fileId, s3Key }),
            });

            fetchFiles();
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Dashboard</h2>
            <p><b>Role: {role}</b></p>

            <button onClick={onLogout}>Logout</button>

            <p>{msg}</p>

            {(role === "admin" || role === "editor") && (
                <form onSubmit={uploadFile} style={{ marginTop: 20 }}>
                    <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Uploading..." : "Upload"}
                    </button>
                </form>
            )}

            <table border="1" cellPadding="5" style={{ marginTop: 20, width: "100%" }}>
                <thead>
                <tr>
                    <th>File Name</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {files.map((f) => (
                    <tr key={f.fileId}>
                        <td>{f.fileName}</td>
                        <td>
                            <button onClick={() => downloadFile(f.s3Key)}>Download</button>

                            {(role === "admin" || (role === "editor" && f.owner === userSub)) && (
                                <button onClick={() => deleteFile(f.fileId, f.s3Key)}>
                                    Delete
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
