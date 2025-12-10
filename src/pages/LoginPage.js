import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const payload = {
      username: formData.identifier,
      password: formData.password,
    };

    try {
      const res = await fetch("http://localhost:8080/api/authentication/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.code !== 1000) {
        throw new Error(data.message || data.error || "Login failed");
      }

      const token = data.data.token;
      localStorage.setItem("token", token);

      const decoded = jwtDecode(token);

      const role = decoded.scope;
      if (!role) throw new Error("Invalid token: missing role");

      if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/user/dashboard");
      }

    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="form-container">
        <h1 className="page-title">Welcome Back</h1>
        <p className="form-subtitle">Log in to manage your bookings.</p>

        <form id="login-form" className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="identifier">Email or Username</label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              required
              placeholder="Enter your email or username"
              value={formData.identifier}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-accent btn-block">
            Log In
          </button>
        </form>

        <p className="form-switch-link">
          Don't have an account? <Link to="/register">Sign up now</Link>
          <br />
          <br />
          <Link to="/">Back to Home</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
