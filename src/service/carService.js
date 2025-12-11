const API_URL = "http://localhost:8080/api/cars";

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

const carService = {
  getAll: async () => {
    const response = await fetch(API_URL, {
      headers: getAuthHeader(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch cars");
    }
    return response.json();
  },
  getMyCars: async () => {
    const response = await fetch(`${API_URL}/me`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch my cars");
    }
    return response.json();
  },

  getById: async (id) => {
    const response = await fetch(`${API_URL}/${id}`, {
      headers: getAuthHeader(),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch car");
    }
    return response.json();
  },

  create: async (carData) => {
    const jsonData = {
      brand: carData.brand,
      model: carData.model,
      seat: carData.seat,
      plate: carData.plate,
      pricePerDay: carData.pricePerDay,
      imgUrl: carData.imgUrl,
    };

    const response = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeader(),
      body: JSON.stringify(jsonData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to post car");
    }

    return response.json();
  },
};

export default carService;
