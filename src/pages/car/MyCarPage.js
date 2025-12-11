import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import carService from "../../service/carService";

function MyCarPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  // Fetch user's cars
  const fetchMyCars = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await carService.getMyCars();
      // Handle different response formats
      if (Array.isArray(response)) {
        setCars(response);
      } else if (response.data && Array.isArray(response.data)) {
        setCars(response.data);
      } else if (response.code === 1000 && Array.isArray(response.data)) {
        setCars(response.data);
      } else {
        console.error("Unexpected response format:", response);
        setCars([]);
      }
    } catch (error) {
      console.error("Error fetching my cars:", error);
      setError("Failed to load your cars. Please try again.");
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCars();
  }, []);

  // Filter cars based on search term
  const filteredCars = Array.isArray(cars)
    ? cars.filter(
        (car) =>
          car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.plate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          car.id?.toString().includes(searchTerm)
      )
    : [];

  // Format price in VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <section className="car-listing-page">
      <div className="container">
        <h1 className="page-title">My Cars</h1>
        <p className="page-subtitle">View all the cars you have posted.</p>

        {error && (
          <div
            className="error-message"
            style={{
              color: "red",
              marginBottom: "1rem",
              padding: "0.75rem",
              backgroundColor: "#fee",
              borderRadius: "4px",
            }}
          >
            {error}
          </div>
        )}

        {/* Search */}
        <div style={{ marginBottom: "2rem" }}>
          <input
            type="text"
            placeholder="Search by brand, model, or plate..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              maxWidth: "400px",
              padding: "0.75rem",
              fontSize: "1rem",
              border: "1px solid #ddd",
              borderRadius: "4px",
            }}
          />
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="loading">Loading your cars...</div>
        ) : (
          <>
            {/* Empty State */}
            {filteredCars.length === 0 && !loading ? (
              <div style={{ textAlign: "center", padding: "3rem" }}>
                <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                  {cars.length === 0
                    ? "You haven't posted any cars yet."
                    : "No cars match your search."}
                </p>
                {cars.length === 0 && (
                  <Link to="/post-car" className="btn btn-primary">
                    Post Your First Car
                  </Link>
                )}
              </div>
            ) : (
              /* Cars Grid */
              <div className="car-grid">
                {filteredCars.map((car) => (
                  <div key={car.id} className="car-card">
                    <img
                      src={car.imgUrl || "/images/placeholder.jpg"}
                      alt={`${car.brand} ${car.model}`}
                      onError={(e) => {
                        e.target.src = "/images/placeholder.jpg";
                      }}
                    />
                    <div className="car-card-content">
                      <h3>
                        {car.brand} {car.model}
                      </h3>
                      <p style={{ margin: "0.5rem 0" }}>
                        <strong>Plate:</strong> {car.plate}
                      </p>
                      <p style={{ margin: "0.5rem 0" }}>
                        <strong>Seats:</strong> {car.seat}
                      </p>
                      <p className="price">
                        {formatPrice(car.pricePerDay)} / day
                      </p>
                      <div style={{ marginTop: "1rem" }}>
                        <Link
                          to={`/cars/${car.id}`}
                          className="btn btn-primary"
                          style={{ width: "100%" }}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default MyCarPage;
