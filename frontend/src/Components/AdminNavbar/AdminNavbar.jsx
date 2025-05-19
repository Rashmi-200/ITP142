import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../Images/logo.jpg';
import './AdminNavbar.css'; // Use your new style!

const AdminNavbar = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(!!localStorage.getItem('adminToken'));
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const updateStatus = () => {
      setIsAdminLoggedIn(!!localStorage.getItem('adminToken'));
    };

    window.addEventListener('storage', updateStatus);
    window.addEventListener('loginStatusChanged', updateStatus);

    return () => {
      window.removeEventListener('storage', updateStatus);
      window.removeEventListener('loginStatusChanged', updateStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdminLoggedIn(false);
    window.dispatchEvent(new Event("loginStatusChanged"));
    navigate('/admin/login');
  };

  const isActive = (path) => currentPath === path;

  return (
    <div className="navbar">
      <div className="nav-logo" onClick={() => navigate('/admin')}>
        <img src={logo} alt="SmartHomeCare Admin" />
        <p>SmartHomeCare Admin</p>
      </div>

      <ul className="nav-menu">
        <li className={isActive('/admin') ? 'active' : ''} onClick={() => navigate('/admin')}>
          Dashboard {isActive('/admin') && <hr />}
        </li>
        <li onClick={() => navigate('/admin/providers')}>Provider Management</li>
        <li onClick={() => navigate('/admin/customers')}>Customer Management</li>
        <li onClick={() => navigate('/admin/bookings')}>Booking Management</li>
        <li onClick={() => navigate('/admin/complaints')}>Complaint Management</li>
      </ul>

      <div className="nav-buttons">
        {isAdminLoggedIn ? (
          <button className="signup-btn" onClick={handleLogout}>Logout</button>
        ) : (
          <>
            <button className="login-btn" onClick={() => navigate('/admin/login')}>Login</button>
            <button className="signup-btn" onClick={() => navigate('/admin/register')}>Register</button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminNavbar;  