import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import carService from "../../service/carService";
import cloudinaryService from "../../service/cloudinaryService";

function PostCarPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    seat: "",
    plate: "",
    pricePerDay: "",
  });

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFile = e => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!file) {
      setError("Please select an image for your car.");
      return;
    }

    setLoading(true);
    try {
      const data = await cloudinaryService.uploadOneImage(file);
      const imgUrl = data.secure_url;

      const payload = {
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        seat: parseInt(formData.seat),
        plate: formData.plate.trim(),
        pricePerDay: parseFloat(formData.pricePerDay),
        imgUrl: imgUrl
      };

      await carService.create(payload);

      setSuccess("Car posted successfully!");

      setFormData({
        brand: "",
        model: "",
        seat: "",
        plate: "",
        pricePerDay: "",
      });

      setFile(null);
      setPreview(null);

      setTimeout(() => navigate("/cars"), 1500);
    } catch (err) {
      console.error(err);
      setError("Failed to post car. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="form-container">
        <h1 className="form-title">Post Your Car</h1>
        <p className="form-subtitle">Share your car with our community.</p>

        {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
        {success && <div style={{ color: "green", marginBottom: "1rem" }}>{success}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {[
            { id: "brand", label: "Brand", placeholder: "e.g., Toyota" },
            { id: "model", label: "Model", placeholder: "e.g., Camry" },
            { id: "seat", label: "Number of Seats", type: "number", placeholder: "4" },
            { id: "plate", label: "License Plate", placeholder: "30A-12345" },
            {
              id: "pricePerDay",
              label: "Price per Day (VND)",
              type: "number",
              step: "1000",
              placeholder: "1000000",
            },
          ].map(field => (
            <div className="form-group" key={field.id}>
              <label htmlFor={field.id}>{field.label}</label>
              <input
                id={field.id}
                name={field.id}
                type={field.type || "text"}
                value={formData[field.id]}
                placeholder={field.placeholder}
                required
                onChange={handleChange}
              />
            </div>
          ))}

          <div className="form-group">
            <label>Car Image</label>
            <input type="file" accept="image/*" onChange={handleFile} />
            {preview && <img src={preview} alt="preview" width="200" />}
          </div>

          <button type="submit" className="btn btn-accent btn-block" disabled={loading}>
            {loading ? "Posting..." : "Post Car"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostCarPage;
