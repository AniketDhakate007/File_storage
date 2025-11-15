// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/*
  Make sure these files exist under src/pages and default-export their components:
    - Landing.js        -> export default Landing
    - Login.js          -> export default Login
    - Signup.js         -> export default Signup
    - Dashboard.js      -> export default Dashboard
    - UserInfo.js       -> export default UserInfo
    - FileManagement.js -> export default FileManagement
    - Analytics.js      -> export default Analytics
    - Activities.js     -> export default Activities
    - Upload.js         -> export default Upload
    - Error.js          -> export default ErrorPage  (or adjust import name)
*/

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import UserInfo from "./pages/UserInfo";
import FileManagement from "./pages/FileManagement";
import Analytics from "./pages/Analytics";
import Activities from "./pages/Activities";
import Upload from "./pages/Upload";
import ErrorPage from "./pages/Error";
import About from "./pages/About";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public / landing */}
        <Route path="/" element={<Landing />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Main app */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/userinfo" element={<UserInfo />} />

        {/* Files */}
        <Route path="/files" element={<FileManagement />} />
        <Route path="/files/upload" element={<Upload />} />
        {/* optional file detail route */}
        <Route path="/files/:fileId" element={<FileManagement />} />

        {/* Activity & Analytics */}
        <Route path="/activities" element={<Activities />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/about" element={<About />} />


        {/* Fallback / error */}
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}

export default App;
