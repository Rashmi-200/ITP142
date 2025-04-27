import React, { useState } from 'react';
import './Navbar.css';
import { useNavigate } from 'react-router-dom';

import logo from '../Images/logo.jpg';

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  return (
    <div className='navbar'>
      {/* Logo Section */}
      <div className="nav-logo" onClick={() => navigate('/')}>
        <img src={logo} alt="SmartHomeCare Logo" />
        <p>SmartHomeCare</p>
      </div>

      {/* Navbar Menu */}
      <ul className='nav-menu'>
        <li onClick={() => { setMenu("home"); navigate('/'); }}>Home{menu === "home" ? <hr /> : <></>}</li>
        <li onClick={() => { setMenu("services"); }}>Services{menu === "services" ? <hr /> : <></>}</li>
        <li onClick={() => { setMenu("about"); }}>About Us{menu === "about" ? <hr /> : <></>}</li>
        <li onClick={() => { setMenu("contact"); }}>Contact Us{menu === "contact" ? <hr /> : <></>}</li>
      </ul>

      {/* Phone Number */}
      <div className="nav-contact">
        <p>📞 +94 77 123 4567</p>
      </div>

      {/* Buttons Section */}
      <div className='nav-buttons'>
        {/* Sign Up Button */}
        <button className="signup-btn" onClick={() => navigate('/newpage')}>Sign Up</button>

        {/* Profile Icon */}
        <img
          src="/profile.jpg"
          alt="Profile"
          className="profile-icon"
          onClick={() => navigate('/profile')}
        />
      </div>
    </div>
  )
}

export default Navbar;
