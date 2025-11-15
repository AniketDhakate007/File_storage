import React from "react";

export default function LandingPage({ onStart }) {
    return (
        <div style={{
            textAlign: "center",
            marginTop: "120px",
            color: "white",
            fontFamily: "Arial"
        }}>
            <h1 style={{ fontSize: "48px" }}>Secure Cloud File Storage</h1>

            <p style={{ opacity: 0.8, marginTop: "10px", fontSize: "20px" }}>
                Upload · Download · Manage files securely using AWS
            </p>

            <button
                onClick={onStart}
                style={{
                    marginTop: "40px",
                    padding: "14px 28px",
                    fontSize: "20px",
                    fontWeight: "bold",
                    borderRadius: "6px",
                    cursor: "pointer"
                }}
            >
                Get Started
            </button>
        </div>
    );
}
