import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      const res = await axios.post('http://localhost:4000/api/auth/send-reset-otp', { email });
      setMessage(res.data.message);
      if (res.data.success) {
        // Store email temporarily in localStorage or pass via navigation state
        localStorage.setItem('resetEmail', email);
        navigate('/reset-password');
      }
    } catch (err) {
      setMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="forgot-password-container">
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Forgot Password</h2>
      <input
        type="email"
        className="border p-2 mb-4 w-full"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handleSendOtp}
        className="bg-blue-500 text-white py-2 px-4 rounded w-full"
      >
        Send OTP
      </button>
      <p className="mt-4 text-sm text-center">{message}</p>
    </div>
    </div>
  );
};

export default ForgotPassword;
