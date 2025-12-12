import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Header() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="main-header">
      <div className="container">
        <Link to="/" className="logo">
          M
        </Link>
        <nav className="main-nav">
          <ul>
            <li>
              <NavLink to="/">Home</NavLink>
            </li>
            <li>
              <NavLink to="/cars">All Cars</NavLink>
            </li>
            {/* Đã xóa Post Car và My Cars ở đây theo yêu cầu trước */}
            <li>
              <NavLink to="/about">About Us</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Contact</NavLink>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              {/* 1. Dòng chào user (Bên trái) */}
              <span style={{ fontWeight: "bold", color: "#fff" }}>
                Hello, {user.username}
              </span>

              {/* 2. Nút My Profile (Ở giữa) */}
              <Link
                to="/my-profile"
                className="btn btn-primary" // Bạn có thể đổi thành btn-secondary nếu muốn màu khác
                style={{ textDecoration: "none" }}
              >
                My Profile
              </Link>

              {/* 3. Nút Logout (Bên phải) */}
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="btn btn-secondary"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-secondary">
                Log In
              </NavLink>
              <NavLink to="/register" className="btn btn-primary">
                Sign Up
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
