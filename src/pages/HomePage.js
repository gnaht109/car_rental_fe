import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-background-overlay"></div>
        <div className="hero-content container">
          <h1 className="hero-title">Experience the Drive of a Lifetime</h1>
          <p className="hero-subtitle">
            Rent the exotic car you've always dreamed of. Unforgettable moments
            are just a click away.
          </p>
          <Link to="/cars" className="btn btn-accent">
            Browse Our Collection
          </Link>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <h2 className="section-title">Rent in Three Easy Steps</h2>
          <div className="steps-grid">
            <div className="step">
              <i className="fas fa-car-side icon"></i>
              <h3>1. Choose Your Car</h3>
              <p>
                Browse our curated collection of the world's most desirable
                vehicles and find your perfect ride.
              </p>
            </div>
            <div className="step">
              <i className="fas fa-calendar-alt icon"></i>
              <h3>2. Book Your Dates</h3>
              <p>
                Select your desired dates and confirm your booking securely
                online in just a few minutes.
              </p>
            </div>
            <div className="step">
              <i className="fas fa-key icon"></i>
              <h3>3. Enjoy the Ride</h3>
              <p>
                We deliver your dream car directly to you. All that's left is to
                get behind the wheel and enjoy the experience.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
