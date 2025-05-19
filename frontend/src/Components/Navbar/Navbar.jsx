import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../Images/logo.jpg';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const updateAuthStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    window.addEventListener('storage', updateAuthStatus);
    window.addEventListener('loginStatusChanged', updateAuthStatus);

    return () => {
      window.removeEventListener('storage', updateAuthStatus);
      window.removeEventListener('loginStatusChanged', updateAuthStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    setIsLoggedIn(false);
    window.dispatchEvent(new Event("loginStatusChanged"));
    navigate('/');
  };

  const isActive = (path) => currentPath === path;

  return (
    <div className='navbar'>
      <div className="nav-logo" onClick={() => navigate('/')}>
        <img src={logo} alt="SmartHomeCare Logo" />
        <p>SmartHomeCare</p>
      </div>

      <ul className='nav-menu'>
        <li className={isActive('/') ? 'active' : ''} onClick={() => navigate('/')}>
          Home {isActive('/') && <hr />}
        </li>
        <li className={isActive('/services') ? 'active' : ''} onClick={() => navigate('/services')}>
          Services {isActive('/services') && <hr />}
        </li>
        <li className={isActive('/AboutUs') ? 'active' : ''} onClick={() => navigate('/AboutUs')}>
          About Us {isActive('/AboutUs') && <hr />}
        </li>
        <li className={isActive('/ContactUs') ? 'active' : ''} onClick={() => navigate('/ContactUs')}>
          Contact Us {isActive('/ContactUs') && <hr />}
        </li>
      </ul>

      <div className="nav-contact">
        <p>📞 +94 77 123 4567</p>
      </div>

      <div className='nav-buttons'>
        {isLoggedIn ? (
          <>
            <button className="signup-btn animated" onClick={handleLogout}>Logout</button>
            <img
              src="/profile.jpg"
              alt="Profile"
              className={`profile-icon ${isActive('/profile') ? 'active-profile' : ''}`}
              onClick={() => navigate('/profile')}
            />
          </>
        ) : (
          <>
            <button className="login-btn animated" onClick={() => navigate('/login')}>Login</button>
            <button className="signup-btn animated" onClick={() => navigate('/newpage')}>Sign Up</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
