import React from "react";
import { Link, NavLink } from "react-router-dom";

function Header() {
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
            <li>
              <NavLink to="/about">About Us</NavLink>
            </li>
            <li>
              <NavLink to="/contact">Contact</NavLink>
            </li>
          </ul>
        </nav>
        <div className="header-actions">
          <NavLink to="/login" className="btn btn-secondary">
            Log In
          </NavLink>
          <NavLink to="/register" className="btn btn-primary">
            Sign Up
          </NavLink>
        </div>
      </div>
    </header>
  );
}

export default Header;
