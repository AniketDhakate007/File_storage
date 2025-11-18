import React, { useEffect, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";

const API_BASE = "https://t7z7i3v7ua.execute-api.eu-north-1.amazonaws.com/prod";

export default function Dashboard({ onLogout }) {
    const [files, setFiles] = useState([]);
    const [filteredFiles, setFilteredFiles] = useState([]);
    const [role, setRole] = useState(null);
    const [userSub, setUserSub] = useState(null);
    const [file, setFile] = useState(null);
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState("list");
    const [isDragging, setIsDragging] = useState(false);

    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    const getIdToken = async () => {
        const session = await fetchAuthSession();
        return session.tokens.idToken.toString();
    };

    const loadSession = async () => {
        try {
            const session = await fetchAuthSession();
            const idToken = session.tokens.idToken.payload;
            const groups = idToken["cognito:groups"] || [];
            const userRole = groups[0] ? groups[0].toLowerCase() : "viewer";

            setRole(userRole);
            setUserSub(idToken["sub"]);
        } catch (err) {
            onLogout();
        }
    };

    const fetchFiles = async () => {
        try {
            const token = await getIdToken();
            const res = await fetch(`${API_BASE}/files`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            let text = await res.text();
            if (!res.ok) throw new Error(text);

            const fetchedFiles = JSON.parse(text);
            setFiles(fetchedFiles);
            setFilteredFiles(fetchedFiles);
        } catch (err) {
            setMsg("Session expired — please login again.");
            onLogout();
        }
    };

    useEffect(() => {
        loadSession().then(fetchFiles);
    }, []);

    useEffect(() => {
        if (searchQuery) {
            setFilteredFiles(
                files.filter(f =>
                    f.fileName.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        } else {
            setFilteredFiles(files);
        }
    }, [searchQuery, files]);

    const getFileIcon = (fileName) => {
        const ext = fileName.split('.').pop().toLowerCase();

        if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) {
            return (
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
            );
        }
        if (['pdf'].includes(ext)) {
            return (
                <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
            );
        }
        if (['doc', 'docx', 'txt'].includes(ext)) {
            return (
                <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
            );
        }
        if (['xls', 'xlsx', 'csv'].includes(ext)) {
            return (
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
            );
        }
        if (['zip', 'rar', '7z', 'tar'].includes(ext)) {
            return (
                <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                    <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
            );
        }

        return (
            <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
        );
    };

    const uploadFile = async () => {
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
                body: JSON.stringify({
                    fileName: file.name,
                    contentType: file.type,
                }),
            });

            const data = await res.json();
            await fetch(data.uploadUrl, { method: "PUT", body: file });

            setMsg("File uploaded successfully");
            setFile(null);
            fetchFiles();
        } catch (err) {
            setMsg("Upload failed");
        }

        setLoading(false);
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
        }
    };

    const downloadFile = async (s3Key) => {
        try {
            const token = await getIdToken();
            const res = await fetch(
                `${API_BASE}/download-url?s3Key=${encodeURIComponent(s3Key)}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const data = await res.json();
            window.open(data.downloadUrl, "_blank");
        } catch (err) {}
    };

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

            setMsg("File deleted");
            fetchFiles();
        } catch (err) {
            setMsg("Delete failed");
        }
    };

    const loadHistory = async () => {
        setHistoryLoading(true);
        try {
            const token = await getIdToken();
            const res = await fetch(`${API_BASE}/download-history`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            let txt = await res.text();
            if (!res.ok) throw new Error(txt);

            setHistory(JSON.parse(txt));
            setShowHistory(true);
        } catch (err) {
            setMsg("Failed to load history");
        }
        setHistoryLoading(false);
    };

    const formatFileSize = (bytes) => {
        if (!bytes) return "—";
        const kb = bytes / 1024;
        if (kb < 1024) return `${kb.toFixed(1)} KB`;
        return `${(kb / 1024).toFixed(1)} MB`;
    };

    return (
        <div className="min-h-screen bg-white">
            {/* HEADER */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-screen-2xl mx-auto px-6 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-8">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                                    </svg>
                                </div>
                                <h1 className="text-xl font-semibold text-gray-900">Drive</h1>
                            </div>

                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    type="text"
                                    placeholder="Search in Drive"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-96 pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700 capitalize">
                                {role}
                            </span>

                            <button
                                onClick={loadHistory}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                title="Activity"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </button>

                            <button
                                onClick={onLogout}
                                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <div className="max-w-screen-2xl mx-auto px-6 py-6">
                {/* MESSAGE */}
                {msg && (
                    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">{msg}</p>
                    </div>
                )}

                {/* UPLOAD SECTION */}
                {(role === "admin" || role === "editor") && (
                    <div className="mb-6">
                        <div
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
                                isDragging
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                            }`}
                        >
                            <div className="text-center">
                                {file ? (
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                                        <p className="text-xs text-gray-500 mt-1">{formatFileSize(file.size)}</p>
                                        <div className="mt-4 flex gap-3 justify-center">
                                            <button
                                                onClick={uploadFile}
                                                disabled={loading}
                                                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                {loading ? "Uploading..." : "Upload"}
                                            </button>
                                            <button
                                                onClick={() => setFile(null)}
                                                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium rounded-lg transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <svg className="mx-auto w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        <p className="text-sm text-gray-700 mb-3">Drag files here or click to browse</p>
                                        <input
                                            type="file"
                                            onChange={(e) => setFile(e.target.files[0])}
                                            className="hidden"
                                            id="fileInput"
                                        />
                                        <label
                                            htmlFor="fileInput"
                                            className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors cursor-pointer"
                                        >
                                            Select file
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* TOOLBAR */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">My files</h2>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded transition-colors ${
                                viewMode === "list" ? 'bg-gray-200' : 'hover:bg-gray-100'
                            }`}
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded transition-colors ${
                                viewMode === "grid" ? 'bg-gray-200' : 'hover:bg-gray-100'
                            }`}
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* FILES LIST */}
                {filteredFiles.length === 0 ? (
                    <div className="text-center py-16">
                        <svg className="mx-auto w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <p className="text-gray-500">No files yet</p>
                    </div>
                ) : viewMode === "list" ? (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {filteredFiles.map((f) => (
                                <tr key={f.fileId} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            {getFileIcon(f.fileName)}
                                            <span className="text-sm font-medium text-gray-900">{f.fileName}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <button
                                            onClick={() => downloadFile(f.s3Key)}
                                            className="inline-flex items-center gap-1 px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            Download
                                        </button>
                                        {(role === "admin" || (role === "editor" && f.owner === userSub)) && (
                                            <button
                                                onClick={() => deleteFile(f.fileId, f.s3Key)}
                                                className="ml-2 inline-flex items-center gap-1 px-3 py-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                                Delete
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {filteredFiles.map((f) => (
                            <div
                                key={f.fileId}
                                className="group border border-gray-200 rounded-lg p-4 hover:bg-gray-50 hover:shadow-sm transition-all cursor-pointer"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="mb-3">
                                        {getFileIcon(f.fileName)}
                                    </div>
                                    <p className="text-sm text-gray-900 font-medium truncate w-full mb-2">
                                        {f.fileName}
                                    </p>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => downloadFile(f.s3Key)}
                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                            title="Download"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                        </button>
                                        {(role === "admin" || (role === "editor" && f.owner === userSub)) && (
                                            <button
                                                onClick={() => deleteFile(f.fileId, f.s3Key)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                title="Delete"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* HISTORY MODAL */}
            {showHistory && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">Activity</h2>
                            <button
                                onClick={() => setShowHistory(false)}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[calc(80vh-100px)]">
                            {historyLoading ? (
                                <div className="text-center py-8">
                                    <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                                </div>
                            ) : history.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No activity yet</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {history.map((h, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                            <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-900">
                                                    <span className="font-medium">{h.downloadedBy}</span> downloaded <span className="font-medium">{h.fileName}</span>
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">{h.timestamp}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
