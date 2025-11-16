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
        setMsg("");

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

            setMsg("File uploaded successfully!");
            setFile(null);
            fetchFiles();
        } catch (err) {
            console.error("Upload error:", err);
            setMsg("Upload failed. Please try again.");
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
        if (!window.confirm("Are you sure you want to delete this file?")) return;

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

            setMsg("File deleted successfully!");
            fetchFiles();
        } catch (err) {
            console.error("Delete error:", err);
            setMsg("Delete failed. Please try again.");
        }
    };

    const getRoleBadgeColor = () => {
        if (role === "admin") return "bg-gradient-to-r from-purple-500 to-violet-500";
        if (role === "editor") return "bg-gradient-to-r from-blue-500 to-indigo-500";
        return "bg-gradient-to-r from-slate-500 to-gray-500";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 relative overflow-hidden">
            {/* Subtle background accents */}
            <div className="absolute top-20 right-20 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl"></div>

            {/* Header */}
            <div className="relative z-10 bg-white/60 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-semibold text-slate-900">
                            File Dashboard
                        </h1>
                        <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getRoleBadgeColor()}`}>
                            {role || "Loading..."}
                        </span>
                    </div>

                    <button
                        onClick={onLogout}
                        className="px-5 py-2 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-all duration-200 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">

                {/* Success/Error Message */}
                {msg && (
                    <div className={`mb-6 flex items-start gap-3 p-4 rounded-xl border ${
                        msg.includes("success")
                            ? "bg-emerald-50 border-emerald-200"
                            : "bg-red-50 border-red-200"
                    }`}>
                        <svg
                            className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                                msg.includes("success") ? "text-emerald-500" : "text-red-500"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            {msg.includes("success") ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            )}
                        </svg>
                        <p className={`text-sm ${msg.includes("success") ? "text-emerald-700" : "text-red-700"}`}>
                            {msg}
                        </p>
                    </div>
                )}

                {/* Upload Section */}
                {(role === "admin" || role === "editor") && (
                    <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/50 p-8 mb-8">
                        <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Upload File
                        </h2>

                        <form onSubmit={uploadFile} className="space-y-4">
                            <div className="relative">
                                <input
                                    type="file"
                                    id="file-upload"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="file-upload"
                                    className="flex items-center justify-center w-full px-6 py-4 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-200"
                                >
                                    <div className="text-center">
                                        <svg className="mx-auto h-12 w-12 text-slate-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className="mt-2 text-sm text-slate-600">
                                            {file ? (
                                                <span className="font-medium text-blue-600">{file.name}</span>
                                            ) : (
                                                <>
                                                    <span className="font-medium text-blue-600">Click to upload</span>
                                                    <span className="text-slate-500"> or drag and drop</span>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || !file}
                                className="w-full px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                                        </svg>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        Upload File
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {/* Files Table */}
                <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl border border-slate-200/50 overflow-hidden">
                    <div className="p-8 border-b border-slate-200/50">
                        <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                            </svg>
                            Your Files
                        </h2>
                    </div>

                    {files.length === 0 ? (
                        <div className="p-12 text-center">
                            <svg className="mx-auto h-16 w-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                            <p className="mt-4 text-slate-500">No files uploaded yet</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50/50">
                                <tr>
                                    <th className="px-8 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        File Name
                                    </th>
                                    <th className="px-8 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200/50">
                                {files.map((f) => (
                                    <tr key={f.fileId} className="hover:bg-slate-50/50 transition-colors duration-150">
                                        <td className="px-8 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <span className="text-sm font-medium text-slate-900">
                                                        {f.fileName}
                                                    </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => downloadFile(f.s3Key)}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors duration-200"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
                                                    Download
                                                </button>

                                                {(role === "admin" || (role === "editor" && f.owner === userSub)) && (
                                                    <button
                                                        onClick={() => deleteFile(f.fileId, f.s3Key)}
                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors duration-200"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                        </svg>
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
