//src\App.js
import React, { useState } from "react";
import { Route, Link, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import WelcomePage from "./components/WelcomePage";
import GradePage from "./components/GradePage";
import ManagementPage from "./components/ManagementPage";
import ManagementWithWelcomePage from "./components/ManagementWithWelcomePage";
import "./App.css";
import lookup from "socket.io-client";
import { useNavigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

const Sidebar = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  const handleLogout = () => {
    localStorage.clear(); // This will clear the entire localStorage, including tokens
    navigate("/"); // Redirects to the login page
  };

  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link to="/">Login Page</Link>
        </li>
        <li>
          <Link to="/welcome">Welcome Page</Link>
        </li>
        <li>
          <Link to="/grade">Grade Page</Link>
        </li>
        {user === "doron" && (
          <li>
            <Link to="/management">Management Page</Link>
          </li>
        )}
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </div>
  );
};
const Content = () => (
  <div className="content">
    <Routes>
      <Route path="/" element={<LoginPage />} />

      <Route
        path="/welcome"
        element={
          <ProtectedRoute>
            <WelcomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/grade"
        element={
          <ProtectedRoute>
            <GradePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/management"
        element={
          <ProtectedRoute>
            <ManagementWithWelcomePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  </div>
);

function App() {
  return (
    <div className="app-layout">
      <Sidebar />
      <Content />
    </div>
  );
}

export default App;
