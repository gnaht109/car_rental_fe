import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section about">
            <h3 className="logo-text">M</h3>
            <p>
              Your premier source for luxury and exotic car rentals. We are
              passionate about providing an unparalleled driving experience from
              start to finish.
            </p>
          </div>
          <div className="footer-section links">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link to="/cars">All Cars</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <a href="/careers">Careers</a>
              </li>
            </ul>
          </div>
          <div className="footer-section social">
            <h3>Follow Us</h3>
            <a
              href="https://www.facebook.com/minh.nguyen.168630"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://www.instagram.com/__ily.sato?igsh=MXNpZmNxaXhsY2R2aA%3D%3D&utm_source=qr"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </a>

            {/* Optional don't have to add */}
            {/* ================== */}
            {/* <a href="#" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a> */}
          </div>
        </div>
        <div className="footer-bottom">&copy; 2025 M | All Rights Reserved</div>
      </div>
    </footer>
  );
}

export default Footer;
