import React, { useState, useEffect } from "react";
import carService from "../../service/carService"; // Import the car data
import CarCard from "../../components/CarCard"; // Import the reusable card component

function CarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await carService.getAll();
        if (Array.isArray(data)) {
          setCars(data);
        } else if (data.data && Array.isArray(data.data)) {
          // Truong hop API tra ve dang { data: [...] }
          setCars(data.data);
        } else if (data.code === 1000 && Array.isArray(data.data)) {
          // Truong hop API tra ve dang { code: 1000, data: [...] }
          setCars(data.data);
        } else {
          console.error("Unexpected response format:", data);
          setCars([]);
        }
      } catch (error) {
        console.error("Failed to fetch cars:", error);
        setCars([]); // Ensure cars is always an array
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  return (
    <section className="car-listing-page">
      <div className="container">
        <h1 className="page-title">Our Entire Collection</h1>
        <p className="page-subtitle">
          Select a vehicle to view details and book your experience.
        </p>
        <div id="car-grid" className="car-grid">
          {cars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default CarsPage;
