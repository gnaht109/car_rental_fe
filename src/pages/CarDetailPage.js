import React from "react";
import { useParams, Link } from "react-router-dom";
import { cars } from "../data/cars";

function CarDetailPage() {
  const { id } = useParams(); // Get the 'id' from the URL (e.g., /cars/1)
  const car = cars.find((c) => c.id === Number.parseInt(id));

  if (!car) {
    return (
      <section>
        <div className="container">
          <h1 className="page-title">Car Not Found</h1>
          <p className="page-subtitle">
            Sorry, the car you are looking for does not exist.
          </p>
          <div style={{ textAlign: "center" }}>
            <Link to="/cars" className="btn btn-primary">
              Back to Collection
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="car-detail-page">
      <div className="container">
        <h1>{car.name}</h1>
        <div className="detail-content-layout">
          <div className="image-gallery">
            <img src={car.detailImage || car.image} alt={car.name} />
          </div>
          <aside className="info-and-booking">
            <h2>Description</h2>
            <p>{car.description}</p>
            <h2>Specifications</h2>
            <ul className="specs-list">
              {Object.entries(car.specs).map(([key, value]) => (
                <li key={key}>
                  <strong>
                    {key.replaceAll(/([A-Z])/g, " $1").toUpperCase()}:
                  </strong>{" "}
                  {value}
                </li>
              ))}
            </ul>
            <div className="booking-box">
              <div className="price-display">
                <span>From</span>
                <span className="price-amount">${car.price}</span>
                <span>/ day</span>
              </div>
              <Link to="/checkout" className="btn btn-accent btn-block">
                Book Now
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default CarDetailPage;
