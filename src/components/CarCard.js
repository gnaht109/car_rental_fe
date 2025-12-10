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
      <img src={car.image} alt={car.name} />
      <div className="car-card-content">
        <h3>{car.name}</h3>
        <p className="price">From ${formatter.format(car.price)} / day</p>
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
    // ...and it must be an object with a specific "shape":
    id: PropTypes.number.isRequired, // 'id' must be a number and is required.
    name: PropTypes.string.isRequired, // 'name' must be a string and is required.
    price: PropTypes.number.isRequired, // 'price' must be a number and is required.
    image: PropTypes.string.isRequired, // 'image' must be a string and is required.
  }).isRequired, // The entire 'car' object itself is also required.
};
// If any of these props are missing or of the wrong type, a warning will be shown in the console during development.

export default CarCard;
