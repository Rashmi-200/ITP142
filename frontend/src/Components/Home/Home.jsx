import React from 'react';
import './Home.css';
import { FaCheckCircle, FaShieldAlt, FaClock, FaUsers } from 'react-icons/fa';
import Landing from '../Images/landing.jpg';
import Clean from '../Images/clean.jpg';
import Repair from '../Images/repair.jpg';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleNavigateToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="home-container">
      {/* Left Section */}
      <div className="home-left">
        <h2>Seamless home service booking at your fingertips - fast, reliable, and hassle-free!</h2>
        <p>
          Our Online Home Service Booking System connects customers with trusted professionals for cleaning, repairs, and maintenance.
          With easy booking, secure payments, real-time tracking, and AI-powered smart reminders, we simplify home service management.
        </p>
        <div className="buttons">
          <button className="book-btn" onClick={handleNavigateToLogin}>Book a Service</button>
          <button className="provider-btn" onClick={() => navigate('/login?type=provider')}>Join as a Provider</button>
        </div>

        {/* Features Section */}
        <div className="features">
          <div className="feature">
            <FaCheckCircle className="icon" />
            <p>Verified & Trusted Professionals</p>
          </div>
          <div className="feature">
            <FaShieldAlt className="icon" />
            <p>Secure Payments & Transactions</p>
          </div>
          <div className="feature">
            <FaClock className="icon" />
            <p>Fast & On-Time Services</p>
          </div>
          <div className="feature">
            <FaUsers className="icon" />
            <p>Thousands of Happy Customers</p>
          </div>
        </div>
      </div>

      {/* Right Section - Collage of 3 Images */}
      <div className="home-right">
        <div className="image-collage">
          <img src={Landing} alt="Landing Service" className="image" />
          <img src={Clean} alt="Cleaning Service" className="image" />
          <img src={Repair} alt="Repair Service" className="image" />
        </div>
      </div>
    </div>
  );
};

export default Home;
