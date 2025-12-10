const API_URL = "http://localhost:8080/api/users";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }
  return {
    "Content-Type": "application/json",
  };
};

const userService = {
  getAll: async () => {
    const response = await fetch(API_URL, {
      headers: getAuthHeader(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    return response.json();
  },
  getById: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    return response.json();
  },
  create: async (user) => {
    const response = await fetch(API_URL, {
      // <-- Gửi vào http://localhost:8080/api/users
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error("Failed to create user");
    }
    return response.json();
  },
  update: async (id, user) => {
    const response = await fetch(API_URL, {
      method: "PUT",
      headers: getAuthHeader(),
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      throw new Error("Failed to update user");
    }
    return response.json();
  },
  delete: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: getAuthHeader(),
    });

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    return response.json().catch(() => ({}));
  }
};

export default userService;
