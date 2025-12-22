import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import userService from "../service/userService";
import rentalService from "../service/rentalService";
import carService from "../service/carService"; // THÊM IMPORT NÀY



function MyProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("info");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // State cho phần My Garage (Chủ xe)
  const [myCars, setMyCars] = useState([]);
  const [selectedCarRentals, setSelectedCarRentals] = useState(null);
  const [viewingCarId, setViewingCarId] = useState(null);

  // State cho phần My Rentals (Người đi thuê)
  const [myRentals, setMyRentals] = useState([]);

  // THÊM STATE NÀY: Dùng để lưu thông tin xe (ảnh, biển số) fetch được từ carId
  const [carDetailsMap, setCarDetailsMap] = useState({});

  // 1. FETCH USER INFO
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await userService.getMyInfo();
        if (res?.data) {
          setUser(res.data);
        } else {
          console.error("Invalid response structure:", res);
        }
      } catch (err) {
        console.error("Failed to load user info", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // 2. LOGIC FETCH BÙ ẢNH XE CHO TAB "MY RENTALS"
  // Vì API Rental Backend không trả về imgUrl, ta dùng carId để gọi API Car lấy bù
  useEffect(() => {
    const fetchCarImages = async () => {
      if (myRentals.length === 0) return;

      const details = { ...carDetailsMap };
      // FIX: Filter out null/undefined carIds
      const uniqueCarIds = [
        ...new Set(
          myRentals
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
            // Chỉ fetch nếu chưa có trong Map
            try {
              const res = await carService.getById(id);
              // FIX: Handle different response formats
              const carData = res.data || res.result || res;
              if (carData && (carData.imgUrl || carData.id)) {
                details[id] = carData;
              } else {
                console.warn(`Invalid car data for ID ${id}:`, carData);
                details[id] = {}; // Set empty to avoid refetching
              }
            } catch (e) {
              console.error(`Failed to fetch car image for ID ${id}`, e);
              details[id] = {}; // Set empty to avoid refetching
            }
          }
        })
      );
      setCarDetailsMap(details);
    };

    if (myRentals.length > 0) {
      fetchCarImages();
    }
  }, [myRentals]);

  // --- LOGIC FETCH DỮ LIỆU CÁC TAB ---
  const fetchMyCars = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/cars/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      setMyCars(json.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMyRentals = async () => {
    try {
      const res = await rentalService.getMyRentals();
      setMyRentals(res.data || []);
      // Mặc định chuyển sang tab my-rentals nếu gọi hàm này (VD: khi quay lại từ trang Booking)
      // setActiveTab("my-rentals");
    } catch (err) {
      console.error(err);
    }
  };

  // CHECK LOCATION STATE FOR TAB NAVIGATION (after functions are defined)
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      // If navigating to my-rentals tab, fetch the rentals
      if (location.state.activeTab === "my-rentals") {
        fetchMyRentals();
      }
    }
    // Note: location.state persists until navigation, which is fine for our use case
  }, [location.state]);

  // --- LOGIC HÀNH ĐỘNG (ACTIONS) ---
  const handleViewCarRentals = async (carId) => {
    try {
      setViewingCarId(carId);
      const res = await rentalService.getRentalsByCarId(carId);
      setSelectedCarRentals(res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load rentals for this car.");
    }
  };

  const handlePayment = async (rentalId) => {
    navigate(`/payment/${rentalId}`);

  };

  const handleCancelRental = async (rentalId) => {
    const confirm = window.confirm(
      "Are you sure you want to cancel this rental?"
    );
    if (confirm) {
      try {
        await rentalService.updateStatus(rentalId, "CANCELLED");
        alert("Rental cancelled successfully.");
        fetchMyRentals();
      } catch (err) {
        alert("Cancel failed: " + err.message);
      }
    }
  };

  const handleOwnerApprove = async (rentalId) => {
    const confirm = window.confirm("Approve this rental request?");
    if (confirm) {
      try {
        await rentalService.updateStatus(rentalId, "ACTIVE");
        alert("Rental approved successfully!");
        if (viewingCarId) {
          handleViewCarRentals(viewingCarId);
        }
      } catch (err) {
        alert("Approve failed: " + err.message);
      }
    }
  };

  const handleOwnerReject = async (rentalId) => {
    const confirm = window.confirm("Reject this rental request?");
    if (confirm) {
      try {
        await rentalService.updateStatus(rentalId, "CANCELLED");
        alert("Rental rejected successfully.");
        if (viewingCarId) {
          handleViewCarRentals(viewingCarId);
        }
      } catch (err) {
        alert("Reject failed: " + err.message);
      }
    }
  };

  // --- RENDER GIAO DIỆN ---
  if (loading)
    return (
      <div className="container profile-page">
        <div className="profile-loading">Loading profile...</div>
      </div>
    );
  if (!user)
    return (
      <div className="container profile-page">
        <div className="profile-error">User not found. Please login again.</div>
      </div>
    );

  return (
    <div className="container profile-page">
      <div className="profile-header">
        <h2>My Profile</h2>
      </div>

      <ul className="profile-tabs">
        <li className="profile-tab-item">
          <button
            className={`profile-tab-button ${
              activeTab === "info" ? "active" : ""
            }`}
            onClick={() => setActiveTab("info")}
          >
            User Info
          </button>
        </li>
        <li className="profile-tab-item">
          <button
            className={`profile-tab-button ${
              activeTab === "my-cars" ? "active" : ""
            }`}
            onClick={() => {
              setActiveTab("my-cars");
              fetchMyCars();
            }}
          >
            My Garage
          </button>
        </li>
        <li className="profile-tab-item">
          <button
            className={`profile-tab-button ${
              activeTab === "my-rentals" ? "active" : ""
            }`}
            onClick={() => {
              setActiveTab("my-rentals");
              fetchMyRentals();
            }}
          >
            My Rentals
          </button>
        </li>
      </ul>

      {/* TAB 1: USER INFO */}
      {activeTab === "info" && (
        <div className="profile-info-card">
          <h4>Personal Information</h4>
          <div className="profile-info-row">
            <div className="profile-info-label">Username:</div>
            <div className="profile-info-value">{user.username}</div>
          </div>
          <div className="profile-info-row">
            <div className="profile-info-label">Email:</div>
            <div className="profile-info-value">{user.email}</div>
          </div>
          <div className="profile-info-row">
            <div className="profile-info-label">Phone:</div>
            <div className="profile-info-value">{user.phone}</div>
          </div>
          <div className="profile-info-row">
            <div className="profile-info-label">Roles:</div>
            <div className="profile-info-value">
              {user.roles &&
                Array.from(user.roles).map((role) => (
                  <span key={role} className="profile-role-badge">
                    {role}
                  </span>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MY GARAGE (OWNER) */}
      {activeTab === "my-cars" && (
        <div className="garage-section">
          <div className="garage-header">
            <h4>My Cars Collection</h4>
            <Link to="/post-car" className="btn btn-success">
              Post New Car
            </Link>
          </div>

          {myCars.length === 0 ? (
            <div className="empty-state">You haven't posted any cars yet.</div>
          ) : (
            <div className="garage-car-grid">
              {myCars.map((car) => (
                <div key={car.id} className="garage-car-card">
                  <img
                    src={car.imgUrl || "https://via.placeholder.com/300"}
                    alt={car.model}
                  />
                  <div className="garage-car-card-body">
                    <h5 className="garage-car-card-title">
                      {car.brand} {car.model}
                    </h5>
                    <span
                      className={`garage-car-status ${
                        car.status === "AVAILABLE" ? "available" : "unavailable"
                      }`}
                    >
                      {car.status}
                    </span>
                    <p className="garage-car-price">${car.pricePerDay}/day</p>

                    <button
                      className="btn btn-outline-primary btn-block"
                      onClick={() => handleViewCarRentals(car.id)}
                    >
                      View Rentals
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewingCarId && (
            <div className="car-rentals-section" id="car-rentals-section">
              <div className="car-rentals-header">
                <h5>Rentals History for Car ID: {viewingCarId}</h5>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => setViewingCarId(null)}
                >
                  Close
                </button>
              </div>

              {!selectedCarRentals || selectedCarRentals.length === 0 ? (
                <p style={{ textAlign: "center", padding: "2rem" }}>
                  No rental history found for this car.
                </p>
              ) : (
                <div className="profile-table-container">
                  <table className="profile-table">
                    <thead>
                      <tr>
                        <th>Rental ID</th>
                        <th>Client</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCarRentals.map((rental) => (
                        <tr key={rental.rentalId}>
                          <td>{rental.rentalId}</td>
                          <td>
                            {rental.clientName || "Unknown"}
                          </td>
                          <td>
                            {new Date(rental.startDate).toLocaleDateString()}
                          </td>
                          <td>
                            {new Date(rental.endDate).toLocaleDateString()}
                          </td>
                          <td>
                            <span
                              className={`status-badge ${rental.status.toLowerCase()}`}
                            >
                              {rental.status}
                            </span>
                          </td>
                          <td>
                            {rental.status === "PENDING" && (
                              <div className="action-buttons-group">
                                <button
                                  className="btn btn-sm btn-success"
                                  onClick={() =>
                                    handleOwnerApprove(rental.rentalId)
                                  }
                                >
                                  Approve
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() =>
                                    handleOwnerReject(rental.rentalId)
                                  }
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MY RENTALS (CLIENT) - Đã cập nhật ảnh và chống Crash */}
      {activeTab === "my-rentals" && (
        <div className="rentals-section">
          <h4>History of Cars I Rented</h4>
          {myRentals.length === 0 ? (
            <div className="empty-state">You haven't rented any cars yet.</div>
          ) : (
            <div className="profile-table-container">
              <table className="profile-table">
                <thead>
                  <tr>
                    <th>Car Details</th>
                    <th>Rental Period</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {myRentals.map((rental) => {
                    // Lấy thông tin chi tiết xe từ Map (đã fetch bù)
                    const carDetails = carDetailsMap[rental.carId] || {};
                    // Logic ảnh: Ưu tiên ảnh fetch được -> ảnh placeholder
                    const displayImg =
                      carDetails.imgUrl ||
                      "https://placehold.co/150x100?text=No+Image";
                    const displayPlate = carDetails.plate || "N/A";
                    const carName =
                      (carDetails.brand && carDetails.model
                        ? `${carDetails.brand} ${carDetails.model}`
                        : null) || rental.carModel || "Unknown Car";

                    return (
                      <tr key={rental.rentalId}>
                        <td>
                          <div
                            style={{
                              display: "flex",
                              gap: "10px",
                              alignItems: "center",
                            }}
                          >
                            <img
                              src={displayImg}
                              alt="Car"
                              style={{
                                width: "80px",
                                height: "60px",
                                objectFit: "cover",
                                borderRadius: "4px",
                              }}
                              // LOGIC CHỐNG CRASH VÀ LOOP
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                  "https://placehold.co/150x100?text=No+Img";
                              }}
                            />
                            <div>
                              <div className="rental-car-details">{carName}</div>
                              <div className="rental-car-plate">
                                Plate: {displayPlate}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="rental-period">
                            <div>
                              From:{" "}
                              {new Date(rental.startDate).toLocaleDateString()}
                            </div>
                            <div>
                              To:{" "}
                              {new Date(rental.endDate).toLocaleDateString()}
                            </div>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`status-badge ${rental.status.toLowerCase()}`}
                          >
                            {rental.status}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons-group">
                            {rental.status === "PENDING" && (
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handlePayment(rental.rentalId)}
                              >
                                Pay Deposit
                              </button>
                            )}
                            {rental.status === "ACTIVE" && (
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() =>
                                  handleCancelRental(rental.rentalId)
                                }
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MyProfilePage;
