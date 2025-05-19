import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Left Section: Logo & Name */}
        <div className="footer-logo">
          <img src={require('../Images/logo.jpg')} alt="SmartHomeCare Logo" />
          <h2>SmartHomeCare</h2>
        </div>

        {/* Middle Section: Quick Links */}
        <ul className="footer-links">
          <li><a href="#">Home</a></li>
          <li><a href="#">Services</a></li>
          <li><a href="#">About</a></li>
          <li><a href="#">Contact</a></li>
        </ul>

        {/* Right Section: Contact Info */}
        <div className="footer-contact">
          <p><i className="fas fa-phone"></i> +94 77 123 4567</p>
          <p><i className="fas fa-envelope"></i> support@smarthomecare.com</p>
        </div>
      </div>

      {/* Services Description */}
      <div className="footer-services">
        <p>
          We offer professional home services including cleaning, repairs, maintenance, and more.
          Our team ensures your home stays in top condition with reliable and affordable solutions.
        </p>
      </div>

      {/* Social Media Section */}
      <div className="footer-social">
        <a href="#"><i className="fab fa-facebook"></i></a>
        <a href="#"><i className="fab fa-whatsapp"></i></a>
        <a href="#"><i className="fab fa-instagram"></i></a>
        <a href="#"><i className="fas fa-envelope"></i></a>
      </div>

      {/* Copyright Section */}
      <div className="footer-bottom">
        <p>© 2025 SmartHomeCare. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
