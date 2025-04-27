import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import './ResetPassword.css';

const ResetPassword = () => {
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const email = localStorage.getItem('resetEmail'); // Get email passed from previous step
  const navigate = useNavigate();  // Initialize useNavigate

  const handleReset = async () => {
    if (!otp || !newPassword) {
      setMessage('Please enter both OTP and new password.');
      return;
    }

    try {
      console.log('Sending request to server with data:', { email, otp, newPassword });
      
      // Make sure the endpoint URL is correct and the backend is running
      const res = await axios.post('http://localhost:4000/api/auth/reset-password', {
        email,
        otp,
        newPassword,
      });

      // Log the response for debugging
      console.log('Server response:', res);

      if (res.data.success) {
        setMessage('Password reset successful!');
        localStorage.removeItem('resetEmail');
        
        // Navigate to the login page after success
        navigate('/login');  // Make sure your login route is correctly set in your React Router
      } else {
        setMessage(res.data.message);
      }
    } catch (err) {
      console.error('Error during password reset:', err);
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="reset-password-container">
      <h2 className="reset-password-header">Reset Password</h2>
      
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
      
      <button
        onClick={handleReset}
        className="reset-password-button"
      >
        Reset Password
      </button>
      
      <p className="reset-password-message">{message}</p>
    </div>
  );
};

export default ResetPassword;
