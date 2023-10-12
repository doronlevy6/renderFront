//src\App.js
import React, { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";
import { Route, Link, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import WelcomePage from "./components/WelcomePage";
import GradePage from "./components/GradePage";
import ManagementPage from "./components/ManagementPage";
import ManagementWithWelcomePage from './components/ManagementWithWelcomePage';
import "./App.css";
import { AuthProvider } from "./contexts/AuthContext";

const Sidebar = () => {
  const { user } = useContext(AuthContext);

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
        {user && user.username === "doron" && (
          <li>
            <Link to="/management">Management Page</Link>
          </li>
        )}
      </ul>
    </div>
  );
};
const Content = () => (
  <div className="content">
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/welcome" element={<WelcomePage />} />
      <Route path="/grade" element={<GradePage />} />
      <Route path="/management" element={<ManagementWithWelcomePage />} />
    </Routes>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <div className="app-layout">
        <Sidebar />
        <Content />
      </div>
    </AuthProvider>
  );
}

export default App;
