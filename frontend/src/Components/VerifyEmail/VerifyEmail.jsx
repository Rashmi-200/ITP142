// src/pages/VerifyEmail.jsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';

const API_URL = 'http://localhost:4000'; // Replace if deployed

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, userId } = location.state || {}; // get email and userId from state

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Login token not found. Please log in again.');
      setLoading(false);
      return;
    }

    // Choose the proper verification endpoint based on user type stored in localStorage.
    const userType = localStorage.getItem('userType'); // "customer" or "serviceProvider"
    const endpoint =
      userType === 'customer'
        ? `${API_URL}/api/auth/verify-account`
        : `${API_URL}/api/serviceProvider/auth/verify-email`;

    try {
      const response = await axios.post(
        endpoint,
        { otp }, // send the OTP entered by user
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        setSuccess('Email verified successfully!');
        setTimeout(() => navigate('/profile'), 2000);
      } else {
        setError(response.data.message || 'Verification failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 10, p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Verify Email
      </Typography>
      <Typography variant="body2" gutterBottom>
        OTP has been sent to <strong>{email}</strong>
      </Typography>
      <TextField
        label="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button
        variant="contained"
        fullWidth
        onClick={handleVerifyOtp}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : 'Verify'}
      </Button>

      {error && (
        <Snackbar open autoHideDuration={3000} onClose={() => setError('')}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
      )}
      {success && (
        <Snackbar open autoHideDuration={3000} onClose={() => setSuccess('')}>
          <Alert severity="success">{success}</Alert>
        </Snackbar>
      )}
    </Box>
  );
};

export default VerifyEmail;
