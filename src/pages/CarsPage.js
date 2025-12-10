import React from "react";
import { cars } from "../data/cars"; // Import the car data
import CarCard from "../components/CarCard"; // Import the reusable card component

function CarsPage() {
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
