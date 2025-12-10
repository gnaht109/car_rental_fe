import React, { useState } from "react"; // <-- 1. Import useState
import { Link, useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate(); // Hook để chuyển trang
  // 2. Tạo state để lưu dữ liệu từ các ô input
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "", // <-- ĐÃ THÊM
  });

  // 3. Hàm này được gọi mỗi khi người dùng gõ chữ vào một ô input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 4. Hàm này được gọi khi người dùng nhấn nút "Create Account"
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Dữ liệu mới đã khớp với back-end
    const registrationData = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      phone: formData.phone, // <-- ĐÃ THÊM
      role: "USER", // <-- Gửi giá trị mặc định
    };

    try {
      // Gửi yêu cầu đến URL chính xác
      const response = await fetch("http://localhost:8080/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registrationData),
      });

      // Xử lý kết quả trả về (thành công hoặc thất bại)
      const resultText = await response.text();
      if (!response.ok) {
        throw new Error(resultText || "Registration failed");
      }

      alert(resultText); // Hiển thị "SIGNUP SUCCESS ..."
      navigate("login"); // Chuyển hướng sang trang đăng nhập sau khi đăng ký thành công
    } catch (error) {
      console.error("Error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="auth-page">
      <div className="form-container">
        <h1 className="form-title">Create Your Account</h1>
        <p className="form-subtitle">
          Join us and get access to the world's finest cars.
        </p>
        {/* 5. Kết nối hàm handleSubmit với form */}
        <form id="register-form" className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="username" // <-- Quan trọng: name phải khớp với key trong state
              required
              placeholder="e.g., Minh Nguyễn"
              value={formData.username} // <-- Kết nối với state
              onChange={handleChange} // <-- Kết nối với state
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel" // type="tel" là chuẩn cho số điện thoại
              id="phone"
              name="phone"
              required
              placeholder="e.g., 0913817818"
              value={formData.phone}
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
              placeholder="Choose a strong password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              type="password"
              id="confirm-password"
              name="confirmPassword"
              required
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-accent btn-block">
            Create Account
          </button>
        </form>
        <p className="form-switch-link">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
