import { useState, useEffect } from "react";
import carService from "../../service/carService";

function CarManagementPage() {
  // State
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // READ: Function to fetch cars
  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await carService.getAll();
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
      console.error(error);
      setCars([]); // Ensure cars is always an array
    } finally {
      setLoading(false);
    }
  };

  // Fetch cars when component mounts
  useEffect(() => {
    fetchCars();
  }, []);

  // SEARCH: Filter logic (Client-side)
  const filteredCars = Array.isArray(cars)
    ? cars.filter(
        (car) =>
          (car.brand + " " + car.model)
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          car.id?.toString().includes(searchTerm)
      )
    : [];

  return (
    <div className="user-management-page">
      <div className="container">
        <h2>Car Management</h2>

        {/* Search */}
        <div className="user-management-header">
          <input
            type="text"
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="loading">Loading cars...</div>
        ) : (
          /* Cars Table */
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Seat</th>
                <th>Plate</th>
                <th>Price Per Day</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {filteredCars.length === 0 ? (
                <tr>
                  <td colSpan="2" className="no-data">
                    No cars found
                  </td>
                </tr>
              ) : (
                filteredCars.map((car) => (
                  <tr key={car.id}>
                    <td>{car.id}</td>
                    <td>
                      {car.brand} {car.model}
                    </td>
                    <td>{car.seat}</td>
                    <td>{car.plate}</td>
                    <td>{car.pricePerDay}</td>
                    <td>{car.imgUrl}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default CarManagementPage;
