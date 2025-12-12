const API_URL = "http://localhost:8080/api/rentals";

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

const rentalService = {
  getMyRentals: async () => {
    const response = await fetch(`${API_URL}/me`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch my rentals");
    }
    return response.json();
  },

  createRental: async (rentalRequest) => {
    // rentalRequest chính là { carId, startDate, endDate }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify(rentalRequest),
    });

    if (!response.ok) {
      // Đọc thông báo lỗi từ backend (VD: "Car is not available")
      const errorText = await response.text();
      // Nếu text là JSON thì parse, không thì trả về text
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || "Failed to book car");
      } catch (e) {
        throw new Error(errorText || "Failed to book car");
      }
    }

    return response.json();
  },
  // 3. Lấy danh sách rental của một chiếc xe cụ thể (Dành cho chủ xe - Owner)
  getRentalsByCarId: async (carId) => {
    const response = await fetch(`${API_URL}/cars/${carId}`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch car rentals");
    }
    return response.json();
  },

  // 4. Cập nhật trạng thái Rental (Dùng cho Payment hoặc Cancel)
  // status: "ACTIVE" hoặc "CANCELLED"
  // 4. Cập nhật trạng thái Rental
  updateStatus: async (rentalId, status) => {
    // 1. URL: Xóa phần ?status=... đi
    const url = `${API_URL}/${rentalId}/status`;

    // 2. Payload: Đóng gói dữ liệu vào JSON
    const payload = {
      status: status, // Backend đang chờ field tên là "status"
    };

    const response = await fetch(url, {
      method: "PATCH",
      headers: getAuthHeader(), // Đã có Content-Type: application/json
      body: JSON.stringify(payload), // 3. Gửi Body
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to update status");
    }
    return response.json();
  },
};

export default rentalService;
