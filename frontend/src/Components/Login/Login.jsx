import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const API_URL = 'http://localhost:4000';

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [state, setState] = useState('Login');
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const type = params.get('type');

    if (type === 'customer') {
      setState('CustomerSignUp');
    } else if (type === 'provider') {
      setState('ServiceProviderSignUp');
    }
  }, [location.search]);

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>
          {state === 'CustomerSignUp'
            ? 'Sign Up as Customer'
            : state === 'ServiceProviderSignUp'
            ? 'Sign Up as Service Provider'
            : 'Login'}
        </h2>
        <p>
          {state === 'CustomerSignUp' || state === 'ServiceProviderSignUp'
            ? 'Create your account'
            : 'Login to your account!'}
        </p>

        {error && <p className="error-message">{error}</p>}

        {state === 'CustomerSignUp' && <CustomerSignUpForm navigate={navigate} setError={setError} />}
        {state === 'ServiceProviderSignUp' && <ServiceProviderSignUpForm navigate={navigate} setError={setError} />}
        {state === 'Login' && <LoginForm navigate={navigate} setError={setError} />}

        <div>
          {state === 'Login' ? (
            <>
              <p>
                Don't have an account?{' '}
                <span className="toggle-link" onClick={() => setState('CustomerSignUp')}>
                  Sign up as Customer
                </span>{' '}
                |{' '}
                <span className="toggle-link" onClick={() => setState('ServiceProviderSignUp')}>
                  Service Provider
                </span>
              </p>
            </>
          ) : (
            <p>
              Already have an account?{' '}
              <span className="toggle-link" onClick={() => setState('Login')}>
                Login
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const CustomerSignUpForm = ({ navigate, setError }) => {
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', phone: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const normalizedFormData = { ...formData, email: formData.email.toLowerCase() };
      const response = await axios.post(`${API_URL}/api/auth/register`, normalizedFormData);
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userType', 'customer');
        window.dispatchEvent(new Event("loginStatusChanged"));
        navigate('/profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
      <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
      <button type="submit">Sign Up</button>
    </form>
  );
};

const ServiceProviderSignUpForm = ({ navigate, setError }) => {
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', phone: '', address: '', serviceType: '', experience: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const requiredFields = ['fullName', 'email', 'password', 'phone', 'address', 'serviceType', 'experience'];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    try {
      const dataToSend = {
        fullName: formData.fullName,
        email: formData.email.toLowerCase(),
        password: formData.password,
        phone: formData.phone,
        address: formData.address,
        serviceType: formData.serviceType,
        experience: Number(formData.experience),
      };

      const response = await axios.post(`${API_URL}/api/serviceProvider/auth/register`, dataToSend);

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userType', 'serviceProvider');
        window.dispatchEvent(new Event("loginStatusChanged"));
        navigate('/provider-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Service Provider registration failed');
    }
  };

  return (
    <form className="service-provider-form" onSubmit={handleSubmit} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
      <div className="form-section">
        <h3>Personal Information</h3>
        <div className="form-group">
          <label htmlFor="fullName">Full Name</label>
          <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required />
        </div>
      </div>
      <div className="form-section">
        <h3>Professional Details</h3>
        <div className="form-group">
          <label htmlFor="serviceType">Service Type</label>
          <select id="serviceType" name="serviceType" value={formData.serviceType} onChange={handleChange} required>
            <option value="">Select a service</option>
            <option value="Cleaning">Cleaning</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Painting">Painting</option>
            <option value="Repairing">Repairing</option>
            <option value="Electrician">Electrician</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="experience">Experience (in years)</label>
          <input type="number" id="experience" name="experience" value={formData.experience} onChange={handleChange} required />
        </div>
      </div>
      <div className="form-group submit-section">
        <button type="submit" className="submit-btn">Sign Up</button>
      </div>
    </form>
  );
};

const LoginForm = ({ navigate, setError }) => {
  const [formData, setFormData] = useState({
    email: '', password: '', userType: 'customer',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const normalizedFormData = { ...formData, email: formData.email.toLowerCase() };

      const loginEndpoint =
        formData.userType === 'customer'
          ? `${API_URL}/api/auth/login`
          : `${API_URL}/api/serviceProvider/auth/login`;

      const response = await axios.post(loginEndpoint, {
        email: normalizedFormData.email,
        password: normalizedFormData.password,
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userType', response.data.userType);
        window.dispatchEvent(new Event("loginStatusChanged"));

        if (response.data.userType === 'serviceProvider') {
          navigate('/provider-dashboard');
        } else {
          navigate('/profile');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleForgotPassword = () => {
    navigate(`/forgot-password?type=${formData.userType}`);
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>User Type:</label>
        <select name="userType" value={formData.userType} onChange={handleChange} required>
          <option value="customer">Customer</option>
          <option value="serviceProvider">Service Provider</option>
        </select>
      </div>
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
      <button type="submit">Login</button>
      <p className="forgot-link" onClick={handleForgotPassword} style={{ cursor: 'pointer', color: '#007bff' }}>
        Forgot Password?
      </p>
    </form>
  );
};

export default Login;
