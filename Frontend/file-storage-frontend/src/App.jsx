import React, { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage.jsx";
import Login from "./pages/login.jsx";
import Dashboard from "./pages/dashboard.jsx";
import { fetchAuthSession } from "aws-amplify/auth";

export default function App() {
    const [page, setPage] = useState("landing");
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        // On refresh, try restoring the session
        fetchAuthSession()
            .then(({ tokens }) => {
                if (tokens && tokens.idToken) {
                    setLoggedIn(true);
                    setPage("dashboard");
                }
            })
            .catch(() => {
                setLoggedIn(false);
                setPage("landing");
            });
    }, []);

    const goToLogin = () => setPage("login");

    const handleLoginSuccess = () => {
        setLoggedIn(true);
        setPage("dashboard");
    };

    const handleLogout = () => {
        localStorage.clear();
        sessionStorage.clear();
        setLoggedIn(false);
        setPage("landing");
    };

    if (page === "landing") return <LandingPage onStart={goToLogin} />;
    if (page === "login") return <Login onSuccess={handleLoginSuccess} />;
    if (page === "dashboard") return <Dashboard onLogout={handleLogout} />;

    return null;
}
