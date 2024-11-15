import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import Unauthorized from "./Unauthorized";

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = Cookies.get("access_token");
  const userRole = Cookies.get("user_role");

  if (!token) {
    return <Navigate to="/login" />;
  }

  // Check if user role is in the allowed roles
  if (!allowedRoles.includes(userRole)) {
    return <Unauthorized />;
  }

  return children;
};

export default PrivateRoute;
