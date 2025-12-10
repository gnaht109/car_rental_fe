import React from "react";
// Import Link from react-router-dom to handle internal navigation
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
              {/* FIX: Use the Link component for internal navigation */}
              <li>
                <Link to="/cars">All Cars</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              {/* FIX: Replaced href="#" with a valid placeholder path */}
              <li>
                <Link to="/careers">Careers</Link>
              </li>
            </ul>
          </div>
          <div className="footer-section social">
            <h3>Follow Us</h3>
            {/* FIX: Replaced href="#" with actual links (even if placeholders) */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>
        <div className="footer-bottom">&copy; 2025 M | All Rights Reserved</div>
      </div>
    </footer>
  );
}

export default Footer;
