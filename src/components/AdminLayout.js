import React from "react";
import { Outlet, Link, NavLink, useNavigate } from "react-router-dom";

/**
 * AdminLayout Component
 * Layout dành riêng cho khu vực quản trị viên
 * Bao gồm sidebar navigation và header cho admin
 */
function AdminLayout() {
  const navigate = useNavigate();

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    // Xóa thông tin đăng nhập khỏi localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    
    // Chuyển hướng về trang đăng nhập
    navigate("/login");
  };

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2 className="admin-logo">Admin Panel</h2>
        </div>
        
        <nav className="admin-nav">
          <ul>
            <li>
              <NavLink to="/admin" end>
                <span className="nav-icon">📊</span>
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/users">
                <span className="nav-icon">👥</span>
                Quản lý người dùng
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/cars">
                <span className="nav-icon">🚗</span>
                Quản lý xe
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/bookings">
                <span className="nav-icon">📅</span>
                Quản lý đặt xe
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/settings">
                <span className="nav-icon">⚙️</span>
                Cài đặt
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/" className="back-to-site">
            <span className="nav-icon">🏠</span>
            Về trang chủ
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Admin Header */}
        <header className="admin-header">
          <div className="admin-header-content">
            <h1 className="admin-page-title">Trang quản trị</h1>
            <div className="admin-header-actions">
              <span className="admin-user-info">
                Xin chào, Admin
              </span>
              <button 
                onClick={handleLogout} 
                className="btn btn-secondary btn-sm"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </header>

        {/* Page Content - Outlet sẽ render các trang admin con */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;

