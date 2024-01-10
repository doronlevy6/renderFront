import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem("user");

  if (!user) {
    // Redirect to the login page if no user data in localStorage
    return <Navigate to="/" />;
  }

  return children; // Render the children components if user data exists
};

export default ProtectedRoute;
