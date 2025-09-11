import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="footer-custom">
    <div className="container footer-container">
      {/* Copyright */}
      <p className="m-0">© 2025 Noted</p>

      {/* Links */}
      <div className="d-flex gap-3">
        <Link to="/" className="footer-link">Home</Link>
        <Link to="/contact" className="footer-link">Contactanos</Link>
        <Link to="/about" className="nav-link footer-link">Sobre nosotros</Link>
      </div>
    </div>
  </footer>
);
