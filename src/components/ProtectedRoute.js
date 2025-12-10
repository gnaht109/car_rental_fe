import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

/**
 * ProtectedRoute Component
 * Component bảo vệ các route, chỉ cho phép người dùng đã đăng nhập và có quyền admin truy cập
 *
 * @param {Object} props - Props của component
 * @param {React.ReactElement} props.children - Component con sẽ được render nếu có quyền truy cập
 * @param {boolean} props.requireAdmin - Nếu true, yêu cầu quyền admin (mặc định: true)
 */

function ProtectedRoute({ children, requireAdmin = true }) {

 const token = localStorage.getItem("token");

  //not login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // Token expired check
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("token");
      return <Navigate to="/login?error=TokenExpired" replace />;
    }

    // Admin check
    if (requireAdmin && decoded.scope !== "ADMIN") {
      return <Navigate to="/login?error=NoPermission" replace />;
    }

    // Auth OK
    return children;

  } catch (err) {
    return <Navigate to="/login?error=InvalidToken" replace />;
  }
}

export default ProtectedRoute;
