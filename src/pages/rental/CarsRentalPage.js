import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import rentalService from "../../service/rentalService";
import carService from "../../service/carService";

function CarsRentalPage() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [carDetailsMap, setCarDetailsMap] = useState({});

  // Fetch car details from carId
  const fetchCarDetails = async (rentalsData) => {
    const details = { ...carDetailsMap };
    // Filter out null/undefined carIds
    const uniqueCarIds = [
      ...new Set(
        rentalsData
          .map((r) => r.carId)
          .filter((id) => id !== null && id !== undefined)
      ),
    ];

    if (uniqueCarIds.length === 0) {
      console.warn("No valid carIds found in rentals");
      return;
    }

    await Promise.all(
      uniqueCarIds.map(async (id) => {
        if (!details[id] && id) {
          try {
            const res = await carService.getById(id);
            // Handle different response formats
            const carData = res.data || res.result || res;
            if (carData && (carData.imgUrl || carData.id)) {
              details[id] = carData;
            } else {
              console.warn(`Invalid car data for ID ${id}:`, carData);
              details[id] = {}; // Set empty to avoid refetching
            }
          } catch (e) {
            console.error(`Failed to fetch car details for ID ${id}`, e);
            details[id] = {}; // Set empty to avoid refetching
          }
        }
      })
    );
    setCarDetailsMap(details);
  };

  // Fetch user's rentals
  const fetchMyRentals = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await rentalService.getMyRentals();
      // Handle different response formats
      let rentalsData = [];
      if (Array.isArray(response)) {
        rentalsData = response;
      } else if (response.data && Array.isArray(response.data)) {
        rentalsData = response.data;
      } else if (response.code === 1000 && Array.isArray(response.data)) {
        rentalsData = response.data;
      } else {
        console.error("Unexpected response format:", response);
        rentalsData = [];
      }
      setRentals(rentalsData);

      // Fetch car details for each rental
      if (rentalsData.length > 0) {
        await fetchCarDetails(rentalsData);
      }
    } catch (error) {
      console.error("Error fetching my rentals:", error);
      setError("Failed to load your rentals. Please try again.");
      setRentals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyRentals();
  }, []);

  // Filter rentals based on search term
  const filteredRentals = Array.isArray(rentals)
    ? rentals.filter((rental) => {
        const car = rental.car || carDetailsMap[rental.carId] || {};
        const searchLower = searchTerm.toLowerCase();
        return (
          (rental.carModel &&
            rental.carModel.toLowerCase().includes(searchLower)) ||
          (car.brand && car.brand.toLowerCase().includes(searchLower)) ||
          (car.model && car.model.toLowerCase().includes(searchLower)) ||
          (car.plate && car.plate.toLowerCase().includes(searchLower)) ||
          (rental.status &&
            rental.status.toLowerCase().includes(searchLower)) ||
          (rental.rentalId && rental.rentalId.toString().includes(searchTerm))
        );
      })
    : [];

  // Format price in VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  // Get status badge style
  const getStatusBadge = (status) => {
    const statusUpper = status?.toUpperCase() || "";
    if (statusUpper === "ACTIVE") {
      return {
        backgroundColor: "rgba(62, 207, 142, 0.2)",
        color: "#3ecf8e",
        padding: "0.25rem 0.75rem",
        borderRadius: "12px",
        fontSize: "0.85rem",
        fontWeight: "600",
        display: "inline-block",
      };
    } else if (statusUpper === "COMPLETED") {
      return {
        backgroundColor: "rgba(139, 147, 167, 0.2)",
        color: "#8b93a7",
        padding: "0.25rem 0.75rem",
        borderRadius: "12px",
        fontSize: "0.85rem",
        fontWeight: "600",
        display: "inline-block",
      };
    } else if (statusUpper === "PENDING") {
      return {
        backgroundColor: "rgba(245, 197, 24, 0.2)",
        color: "#f5c518",
        padding: "0.25rem 0.75rem",
        borderRadius: "12px",
        fontSize: "0.85rem",
        fontWeight: "600",
        display: "inline-block",
      };
    } else if (statusUpper === "CANCELLED") {
      return {
        backgroundColor: "rgba(255, 100, 100, 0.2)",
        color: "#ff6464",
        padding: "0.25rem 0.75rem",
        borderRadius: "12px",
        fontSize: "0.85rem",
        fontWeight: "600",
        display: "inline-block",
      };
    }
    return {
      backgroundColor: "rgba(139, 147, 167, 0.2)",
      color: "#8b93a7",
      padding: "0.25rem 0.75rem",
      borderRadius: "12px",
      fontSize: "0.85rem",
      fontWeight: "600",
      display: "inline-block",
    };
  };

  return (
    <section className="car-listing-page">
      <div className="container">
        <h1 className="page-title">My Rentals</h1>
        <p className="page-subtitle">
          View all the cars you have rented or are currently renting.
        </p>

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
            placeholder="Search by car brand, model, plate, or status..."
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
          <div className="loading">Loading your rentals...</div>
        ) : (
          <>
            {/* Empty State */}
            {filteredRentals.length === 0 && !loading ? (
              <div style={{ textAlign: "center", padding: "3rem" }}>
                <p style={{ fontSize: "1.2rem", marginBottom: "1rem" }}>
                  {rentals.length === 0
                    ? "You haven't rented any cars yet."
                    : "No rentals match your search."}
                </p>
                {rentals.length === 0 && (
                  <Link to="/cars" className="btn btn-primary">
                    Browse Available Cars
                  </Link>
                )}
              </div>
            ) : (
              /* Rentals Grid */
              <div className="car-grid">
                {filteredRentals.map((rental) => {
                  // Get car from rental.car or from carDetailsMap
                  const car = rental.car || carDetailsMap[rental.carId] || {};
                  const carName =
                    (car.brand && car.model
                      ? `${car.brand} ${car.model}`
                      : null) ||
                    rental.carModel ||
                    "Unknown Car";
                  const carId = car.id || rental.carId;

                  return (
                    <div key={rental.id || rental.rentalId} className="car-card">
                      <img
                        src={
                          car.imgUrl ||
                          "https://placehold.co/300x200?text=No+Image"
                        }
                        alt={carName}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/300x200?text=No+Image";
                        }}
                      />
                      <div className="car-card-content">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: "0.5rem",
                          }}
                        >
                          <h3>{carName}</h3>
                          <span style={getStatusBadge(rental.status)}>
                            {rental.status || "UNKNOWN"}
                          </span>
                        </div>
                        <p style={{ margin: "0.5rem 0" }}>
                          <strong>Plate:</strong> {car.plate || "N/A"}
                        </p>
                        <p style={{ margin: "0.5rem 0" }}>
                          <strong>Rental Period:</strong>{" "}
                          {formatDate(rental.startDate)} -{" "}
                          {formatDate(rental.endDate)}
                        </p>
                        {rental.totalPrice && (
                          <p className="price" style={{ margin: "0.5rem 0" }}>
                            <strong>Total:</strong>{" "}
                            {formatPrice(rental.totalPrice)}
                          </p>
                        )}
                        {carId && (
                          <div style={{ marginTop: "1rem" }}>
                            <Link
                              to={`/cars/${carId}`}
                              className="btn btn-primary"
                              style={{ width: "100%" }}
                            >
                              View Car Details
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default CarsRentalPage;
