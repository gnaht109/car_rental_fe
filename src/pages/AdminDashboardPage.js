import React from "react";

/**
 * AdminDashboardPage Component
 * Trang dashboard chính của admin, hiển thị tổng quan thống kê
 */
function AdminDashboardPage() {
  return (
    <div className="admin-dashboard">
      <h2>Dashboard</h2>
      <p className="dashboard-subtitle">Tổng quan hệ thống</p>

      {/* Thống kê tổng quan */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-value">0</div>
            <div className="stat-label">Tổng người dùng</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚗</div>
          <div className="stat-info">
            <div className="stat-value">0</div>
            <div className="stat-label">Tổng xe</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-info">
            <div className="stat-value">0</div>
            <div className="stat-label">Đơn đặt xe</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <div className="stat-value">0</div>
            <div className="stat-label">Doanh thu</div>
          </div>
        </div>
      </div>

      {/* Các thông tin nhanh */}
      <div className="dashboard-actions">
        <h3>Thao tác nhanh</h3>
        <div className="quick-actions">
          <a href="/admin/users" className="quick-action-card">
            <span className="action-icon">👥</span>
            <span className="action-text">Quản lý người dùng</span>
          </a>
          <a href="/admin/cars" className="quick-action-card">
            <span className="action-icon">🚗</span>
            <span className="action-text">Quản lý xe</span>
          </a>
          <a href="/admin/bookings" className="quick-action-card">
            <span className="action-icon">📅</span>
            <span className="action-text">Quản lý đặt xe</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
