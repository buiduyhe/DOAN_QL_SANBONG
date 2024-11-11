// Unauthorized.js
import React from "react";
import { Link } from "react-router-dom";

const Unauthorized = () => (
  <div style={{ textAlign: "center", marginTop: "50px" }}>
    <h2>Access Denied</h2>
    <p>You do not have permission to view this page.</p>
    <Link to="/">Go back to the Home page</Link>
  </div>
);

export default Unauthorized;
