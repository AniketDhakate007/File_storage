// src/pages/Landing.js
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const defaultConfig = {
  hero_title: "CloudSafe",
  hero_tagline: "Secure Scalable Smart Cloud Storage",
  hero_description:
    "Easily upload, manage, and access your files from anywhere. Experience seamless cloud storage with enterprise-grade security.",
  cta_login: "Login",
  cta_signup: "Signup",
  primary_color: "#667eea",
  secondary_color: "#764ba2",
  background_color: "#f8fafc",
  surface_color: "#ffffff",
  text_color: "#1e293b",
  font_family: "Inter",
  font_size: 16,
};

function Landing() {
  const [config, setConfig] = useState(defaultConfig);
  const navigate = useNavigate();

  const handleLogin = () => navigate("/login");
  const handleSignup = () => navigate("/signup");

  const {
    primary_color,
    secondary_color,
    background_color,
    surface_color,
    text_color,
    font_size,
    hero_tagline,
    hero_description,
    cta_login,
    cta_signup,
  } = config;

  return (
    <div
      style={{
        minHeight: "100%",
        backgroundColor: background_color,
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* 🌈 Hero Section */}
      <section
        style={{
          position: "relative",
          background: `linear-gradient(135deg, ${primary_color}, ${secondary_color})`,
          padding: "100px 24px",
          textAlign: "center",
          color: "white",
          minHeight: "600px",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 6 }}
            style={{
              fontSize: "100px",
              marginBottom: "20px",
              textShadow: "0 0 30px rgba(255,255,255,0.2)",
            }}
          >
            ☁️
          </motion.div>
          <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "16px" }}>
            {hero_tagline}
          </h1>
          <p
            style={{
              fontSize: "1.25rem",
              opacity: 0.9,
              marginBottom: "40px",
              lineHeight: 1.7,
              maxWidth: "800px",
              marginInline: "auto",
            }}
          >
            {hero_description}
          </p>
        </motion.div>
      </section>

      {/* 💎 Why CloudSafe */}
      <section
        style={{
          backgroundColor: "#f9fafb",
          padding: "100px 24px",
          textAlign: "center",
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          style={{
            fontSize: "2.4rem",
            fontWeight: 800,
            color: "#1e293b",
            marginBottom: "60px",
          }}
        >
          Why Choose <span style={{ color: "#667eea" }}>CloudSafe?</span>
        </motion.h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "30px",
            flexWrap: "wrap",
          }}
        >
          {[
            {
              icon: "🔒",
              title: "Advanced Security",
              desc: "Your data is encrypted end-to-end with multiple protection layers ensuring privacy.",
            },
            {
              icon: "⚡",
              title: "Lightning Speed",
              desc: "Experience ultra-fast uploads and optimized performance across all devices.",
            },
            {
              icon: "🌍",
              title: "Global Accessibility",
              desc: "Access your files anywhere — securely synced across all platforms.",
            },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              style={{
                background: "white",
                borderRadius: "16px",
                boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
                padding: "40px 30px",
                width: "300px",
                textAlign: "center",
              }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3 + i,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                style={{ fontSize: "50px", marginBottom: "20px" }}
              >
                {feature.icon}
              </motion.div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 700 }}>
                {feature.title}
              </h3>
              <p style={{ color: "#4b5563", marginTop: "10px" }}>
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ⚙️ How It Works */}
      <section
        style={{
          background: "linear-gradient(135deg, #667eea, #764ba2)",
          color: "white",
          padding: "100px 24px",
          textAlign: "center",
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            fontSize: "2.4rem",
            fontWeight: 800,
            marginBottom: "60px",
          }}
        >
          How It Works
        </motion.h2>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "40px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {[
            { icon: "📤", title: "Upload Files", desc: "Upload any file securely with one click." },
            { icon: "🗂️", title: "Organize Easily", desc: "Manage folders, rename files, and keep things structured." },
            { icon: "🔗", title: "Share Instantly", desc: "Generate instant, secure sharing links with permissions." },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
              style={{
                background: "rgba(255,255,255,0.1)",
                borderRadius: "16px",
                padding: "40px 30px",
                width: "280px",
                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                backdropFilter: "blur(8px)",
              }}
            >
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ fontSize: "48px", marginBottom: "16px" }}
              >
                {step.icon}
              </motion.div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 700 }}>
                {step.title}
              </h3>
              <p style={{ opacity: 0.9, marginTop: "8px" }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🌌 Vision Section */}
      <section
        style={{
          backgroundColor: "#f9fafb",
          padding: "100px 24px",
          textAlign: "center",
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            fontSize: "2.4rem",
            fontWeight: 800,
            color: "#1e293b",
            marginBottom: "20px",
          }}
        >
          Our Vision
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            color: "#4b5563",
            fontSize: "1.1rem",
            lineHeight: "1.8",
          }}
        >
          CloudSafe envisions a world where data management is effortless,
          secure, and accessible. We're building the next generation of
          cloud-based collaboration powered by automation, AI, and trust ☁️.
        </motion.p>
      </section>

      {/* 🧭 Final CTA Section (Signup + Login) */}
      <section
        style={{
          background: `linear-gradient(135deg, ${primary_color}, ${secondary_color})`,
          color: "white",
          padding: "100px 24px",
          textAlign: "center",
        }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            fontSize: "2.6rem",
            fontWeight: 800,
            marginBottom: "20px",
          }}
        >
          Ready to Get Started?
        </motion.h2>
        <p
          style={{
            fontSize: "1.2rem",
            opacity: 0.9,
            marginBottom: "40px",
          }}
        >
          Join thousands of users who trust CloudSafe to store and secure their
          data.
        </p>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <motion.button
            whileHover={{
              scale: 1.08,
              boxShadow: "0 10px 30px rgba(255,255,255,0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSignup}
            style={{
              padding: "16px 40px",
              backgroundColor: surface_color,
              color: primary_color,
              border: "none",
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "1.1rem",
              cursor: "pointer",
            }}
          >
            {cta_signup}
          </motion.button>

          <motion.button
            whileHover={{
              scale: 1.08,
              boxShadow: "0 0 20px rgba(255,255,255,0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogin}
            style={{
              padding: "16px 40px",
              background: "transparent",
              color: "white",
              border: "2px solid white",
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "1.1rem",
              cursor: "pointer",
            }}
          >
            {cta_login}
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: surface_color,
          padding: "24px",
          borderTop: `1px solid ${text_color}10`,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: font_size * 0.9,
            color: text_color,
            opacity: 0.7,
            margin: 0,
          }}
        >
          © 2025 CloudSafe. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Landing;
