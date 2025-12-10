import { useState, useEffect } from "react";
import userService from "../service/userService";

function UserManagementPage() {
  // 1. State
  const [users, setUsers] = useState([]); // Khởi tạo mảng rỗng thay vì mockUsers
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // 2. READ: Hàm tải dữ liệu
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAll();
      // Xử lý trường hợp API trả về object với data property
      if (Array.isArray(response)) {
        setUsers(response);
      } else if (response.data && Array.isArray(response.data)) {
        setUsers(response.data);
      } else if (response.code === 1000 && Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        console.error("Unexpected response format:", response);
        setUsers([]);
      }
    } catch (error) {
      console.error(error);
      setUsers([]); // Đảm bảo users luôn là mảng
    } finally {
      setLoading(false);
    }
  };

  // Gọi API khi trang vừa mở
  useEffect(() => {
    fetchUsers();
  }, []);

  // 3. CREATE & UPDATE: Hàm xử lý submit form
  const handleFormSubmit = async (formData) => {
    try {
      if (editingUser) {
        await userService.update(editingUser.id, formData);
        alert("User updated!");
      } else {
        await userService.create(formData);
        alert("User created!");
      }
      setIsFormOpen(false);
      fetchUsers(); // Tải lại danh sách mới nhất từ server
    } catch (error) {
      alert(error.message);
    }
  };

  // 4. DELETE: Hàm xóa
  const handleDelete = async (id) => {
    if (window.confirm("Delete this user?")) {
      try {
        await userService.delete(id);
        // Cập nhật giao diện ngay lập tức
        if (Array.isArray(users)) {
          setUsers(users.filter((u) => u.id !== id));
        }
      } catch (error) {
        alert(error.message);
      }
    }
  };

  // 5. SEARCH: Logic lọc (Client-side)
  const filteredUsers = Array.isArray(users)
    ? users.filter(
        (user) =>
          user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (user.phone &&
            user.phone.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  // 6. Handlers cho form
  const handleOpenForm = (user = null) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };

  return (
    <div className="user-management-page">
      <div className="container">
        <h2>User Management</h2>

        {/* Search và Add Button */}
        <div className="user-management-header">
          <input
            type="text"
            placeholder="Search by username, email or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={() => handleOpenForm()} className="btn btn-primary">
            + Add User
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="loading">Loading users...</div>
        ) : (
          /* Users Table */
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || "-"}</td>
                    <td>{user.role || "USER"}</td>
                    <td>
                      <button
                        onClick={() => handleOpenForm(user)}
                        className="btn btn-secondary btn-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="btn btn-danger btn-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {/* Form Modal */}
        {isFormOpen && (
          <div
            className="modal-overlay"
            onClick={handleCloseForm}
            onKeyDown={(e) => {
              if (e.key === "Escape") handleCloseForm();
            }}
            role="dialog"
            aria-modal="true"
            aria-label="User form modal"
          >
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>{editingUser ? "Edit User" : "Create User"}</h3>
                <button className="modal-close" onClick={handleCloseForm}>
                  ×
                </button>
              </div>
              <UserForm
                user={editingUser}
                onSubmit={handleFormSubmit}
                onCancel={handleCloseForm}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// User Form Component
function UserForm({ user, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    password: "",
    role: user?.role || "USER",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Nếu đang edit, không gửi password nếu để trống
    const submitData = { ...formData };
    if (user && !submitData.password) {
      delete submitData.password;
    }
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="user-form">
      <div className="form-group">
        <label htmlFor="username">Username:</label>
        <input
          id="username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="phone">Phone Number:</label>
        <input
          id="phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="e.g., 0913817818"
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">
          Password {user && "(leave empty to keep current)"}:
        </label>
        <input
          id="password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required={!user}
        />
      </div>
      <div className="form-group">
        <label htmlFor="role">Role:</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn btn-primary">
          {user ? "Update" : "Create"}
        </button>
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default UserManagementPage;
