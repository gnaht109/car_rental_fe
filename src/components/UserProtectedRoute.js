import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function UserProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  // Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // Token expired
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return <Navigate to="/login?error=TokenExpired" replace />;
    }

    // Must have USER permission (admins optional)
    const scope = decoded.scope;

    if (scope !== "USER" && scope !== "ADMIN") {
      return <Navigate to="/login?error=NoPermission" replace />;
    }

    // OK
    return children;
  } catch (err) {
    return <Navigate to="/login?error=InvalidToken" replace />;
  }
}

export default UserProtectedRoute;
