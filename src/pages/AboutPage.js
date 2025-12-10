import React from "react";
import { Link } from "react-router-dom";

function AboutPage() {
  return (
    <>
      <section className="hero about-hero">
        <div className="hero-background-overlay"></div>
        <div className="hero-content container">
          <h1 className="hero-title">
            Crafting Unforgettable Drives Since 2010
          </h1>
          <p className="hero-subtitle">
            We pair automotive icons with effortless service so you can focus on
            the thrill of the journey.
          </p>
          <Link to="/cars" className="btn btn-accent">
            Explore the Fleet
          </Link>
        </div>
      </section>

      {/* Other sections like Mission, Stats, Story, Team go here */}
      {/* You would copy the JSX from your about.html's <main> tag here */}
      <section className="about-team">
        <div className="container">
          <h2 className="section-title">Project Team</h2>
          <p className="page-subtitle">
            This site is a student project lovingly crafted by just the two of
            us.
          </p>
          <div className="team-grid">
            <article className="team-card">
              <img
                src="/images/team-huynh.jpg"
                alt="Portrait of Huỳnh Khắc Tấn Minh"
              />
              <div className="team-card-body">
                <h3>Huỳnh Khắc Tấn Minh</h3>
                <p>Front-End Developer</p>
                <p className="team-bio">
                  Focuses on layout, interaction, and polishing every screen so
                  the experience feels cohesive and modern.
                </p>
              </div>
            </article>
            <article className="team-card">
              <img
                src="/images/team-pham.jpg"
                alt="Portrait of Phạm Nguyễn Việt Thắng"
              />
              <div className="team-card-body">
                <h3>Phạm Nguyễn Việt Thắng</h3>
                <p>Backend Developer</p>
                <p className="team-bio">
                  Manages the server-side logic, database interactions, and
                  builds the APIs that power the website.
                </p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}

export default AboutPage;
