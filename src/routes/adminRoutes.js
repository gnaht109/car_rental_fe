import React from "react";
import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import AdminLayout from "../components/AdminLayout";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import UserManagementPage from "../pages/UserManagementPage";

function AdminRoutes() {
  return (
    <Route
      path="/admin"
      element={
        <ProtectedRoute requireAdmin={true}>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<AdminDashboardPage />} />
      <Route path="users" element={<UserManagementPage />} />
    </Route>
  );
}

export default AdminRoutes;
