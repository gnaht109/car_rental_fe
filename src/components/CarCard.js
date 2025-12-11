import React from "react";
import { Link } from "react-router-dom";

// 1. Import the PropTypes library at the top
import PropTypes from "prop-types";

// This component expects a 'car' object to be passed to it as a prop
function CarCard({ car }) {
  // Formats the price with commas (e.g., 1299 -> 1,299)
  const formatter = new Intl.NumberFormat("en-US");

  return (
    <div className="car-card">
      <img src={car.imgUrl} alt={car.brand + " " + car.model} />
      <div className="car-card-content">
        <h3>{car.brand + " " + car.model}</h3>
        <p className="price">From ${formatter.format(car.pricePerDay)} / day</p>
        {/* The link now points to the dynamic route for the specific car's ID */}
        <Link to={`/cars/${car.id}`} className="btn btn-primary">
          View Details
        </Link>
      </div>
    </div>
  );
}

// 2. Add the validation "manual" at the bottom of the file
CarCard.propTypes = {
  // We declare that 'car' is a prop...
  car: PropTypes.shape({
    id: PropTypes.number.isRequired,
    brand: PropTypes.string.isRequired, // Đổi name -> brand
    model: PropTypes.string.isRequired, // Thêm model
    pricePerDay: PropTypes.number.isRequired, // Đổi price -> pricePerDay
    imgUrl: PropTypes.string.isRequired, // Đổi image -> imgUrl
  }).isRequired, // The entire 'car' object itself is also required.
};

export default CarCard;
