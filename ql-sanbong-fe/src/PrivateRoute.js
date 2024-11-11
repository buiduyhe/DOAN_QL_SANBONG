// PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import Unauthorized from "./Unauthorized";

const PrivateRoute = ({ children, allowedRole }) => {
  const token = Cookies.get("access_token");
  const userRole = Cookies.get("user_role");

  if (!token) {
    return <Navigate to="/login" />;
  }

  // Show Unauthorized message if role is incorrect
  if (userRole !== allowedRole) {
    return <Unauthorized />;
  }

  return children;
};

export default PrivateRoute;
