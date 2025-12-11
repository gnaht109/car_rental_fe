import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import carService from "../../service/carService";

function PostCarPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    seat: "",
    plate: "",
    pricePerDay: "",
    imgUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!formData.brand.trim()) {
      setError("Brand is required");
      return;
    }
    if (!formData.model.trim()) {
      setError("Model is required");
      return;
    }
    if (!formData.seat || Number.parseInt(formData.seat, 10) <= 0) {
      setError("Seat must be a positive number");
      return;
    }
    if (!formData.plate.trim()) {
      setError("License plate is required");
      return;
    }
    if (!formData.pricePerDay || Number.parseFloat(formData.pricePerDay) <= 0) {
      setError("Price per day must be a positive number");
      return;
    }
    if (!formData.imgUrl.trim()) {
      setError("Image URL is required");
      return;
    }

    try {
      setLoading(true);

      // Prepare data according to server format
      const carData = {
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        seat: Number.parseInt(formData.seat, 10),
        plate: formData.plate.trim(),
        pricePerDay: Number.parseFloat(formData.pricePerDay),
        imgUrl: formData.imgUrl.trim(),
      };

      await carService.create(carData);
      setSuccess("Car posted successfully!");

      // Reset form
      setFormData({
        brand: "",
        model: "",
        seat: "",
        plate: "",
        pricePerDay: "",
        imgUrl: "",
      });

      // Redirect to cars page after 2 seconds
      setTimeout(() => {
        navigate("/cars");
      }, 2000);
    } catch (error) {
      console.error("Error posting car:", error);
      setError(error.message || "Failed to post car. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="form-container">
        <h1 className="form-title">Post Your Car</h1>
        <p className="form-subtitle">
          Share your car with our community and start earning.
        </p>

        {error && (
          <div
            className="error-message"
            style={{ color: "red", marginBottom: "1rem" }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            className="success-message"
            style={{ color: "green", marginBottom: "1rem" }}
          >
            {success}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="brand">Brand</label>
            <input
              type="text"
              id="brand"
              name="brand"
              required
              placeholder="e.g., Toyota"
              value={formData.brand}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="model">Model</label>
            <input
              type="text"
              id="model"
              name="model"
              required
              placeholder="e.g., Camry"
              value={formData.model}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="seat">Number of Seats</label>
            <input
              type="number"
              id="seat"
              name="seat"
              required
              min="1"
              placeholder="e.g., 4"
              value={formData.seat}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="plate">License Plate</label>
            <input
              type="text"
              id="plate"
              name="plate"
              required
              placeholder="e.g., 30A-12345"
              value={formData.plate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="pricePerDay">Price per Day (VND)</label>
            <input
              type="number"
              id="pricePerDay"
              name="pricePerDay"
              required
              min="1"
              step="1000"
              placeholder="e.g., 1000000"
              value={formData.pricePerDay}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="imgUrl">Image URL</label>
            <input
              type="url"
              id="imgUrl"
              name="imgUrl"
              required
              placeholder="https://link-anh-xe.com/image.jpg"
              value={formData.imgUrl}
              onChange={handleChange}
            />
            <p
              style={{
                marginTop: "0.5rem",
                fontSize: "0.9rem",
                color: "#666",
              }}
            >
              Enter the URL of your car image
            </p>
          </div>

          <button
            type="submit"
            className="btn btn-accent btn-block"
            disabled={loading}
          >
            {loading ? "Posting..." : "Post Car"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostCarPage;
