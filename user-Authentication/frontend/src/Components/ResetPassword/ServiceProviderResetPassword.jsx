import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ServiceProviderResetPassword.css';

const ServiceProviderResetPassword = () => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const email = localStorage.getItem('resetEmail');
  const navigate = useNavigate();

  const handleReset = async () => {
    if (!otp || !newPassword) {
      setMessage('Please enter both OTP and new password.');
      return;
    }

    try {
      console.log('Sending reset request with:', {
        email,
        otp,
        newPassword,
      });

      const response = await axios.post('http://localhost:4000/api/serviceProvider/auth/reset-password', {
        email,
        otp,
        newPassword,
      });

      console.log('Backend response:', response.data);

      if (response.data.success) {
        setMessage('Password reset successful!');
        localStorage.removeItem('resetEmail');
        navigate('/login');
      } else {
        setMessage(response.data.message || 'Password reset failed.');
      }
    } catch (error) {
      console.error('Reset error:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="reset-password-container">
      <h2 className="reset-password-header">Service Provider Reset Password</h2>

      <div className="input-group">
        <input
          type="text"
          className="reset-password-input"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          autoComplete="off"
        />
      </div>

      <div className="input-group">
        <input
          type="password"
          className="reset-password-input"
          placeholder="Enter New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          autoComplete="off"
        />
      </div>

      <button onClick={handleReset} className="reset-password-button">
        Reset Password
      </button>

      <p className="reset-password-message">{message}</p>
    </div>
  );
};

export default ServiceProviderResetPassword;
