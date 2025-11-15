import React, { useState } from "react";
import { signIn } from "aws-amplify/auth";

export default function Login({ onSuccess }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setMsg("");

        try {
            await signIn({ username, password });
            onSuccess();  // Switch to Dashboard (App.jsx handles this)
        } catch (err) {
            console.error("Login error:", err);
            setMsg("Invalid username/password or user is not confirmed.");
        }
    };

    return (
        <div style={{
            padding: 20,
            maxWidth: 350,
            margin: "80px auto",
            textAlign: "center",
            border: "1px solid #ccc",
            borderRadius: 8
        }}>
            <h2>Login</h2>

            <form onSubmit={handleLogin} style={{ marginTop: 20 }}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{
                        width: "100%",
                        padding: 10,
                        marginBottom: 12,
                        borderRadius: 4
                    }}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                        width: "100%",
                        padding: 10,
                        marginBottom: 12,
                        borderRadius: 4
                    }}
                />

                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "12px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        cursor: "pointer"
                    }}
                >
                    Login
                </button>
            </form>

            {msg && <p style={{ color: "red", marginTop: 15 }}>{msg}</p>}
        </div>
    );
}
