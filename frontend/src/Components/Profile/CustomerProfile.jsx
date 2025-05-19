import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';
import { jwtDecode } from 'jwt-decode';
import { Box, Card, CardContent, Typography, TextField, Button, CircularProgress, Snackbar, Alert, Divider, Grid } from '@mui/material';

const API_URL = 'http://localhost:4000';

const CustomerProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        setLoading(true);
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        const response = await axios.get(`${API_URL}/api/auth/users/data/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setUser(response.data.user);
        } else {
          navigate('/login');
        }
      } catch (err) {
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in again.');
      setOpenSnackbar(true);
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id;
      const response = await axios.put(`${API_URL}/api/auth/update-user/${userId}`, {
        fullName: user.fullName,
        phone: user.phone,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setSuccessMessage('Profile updated successfully!');
        setIsEditing(false);
      }
    } catch (err) {
      setError('Update failed');
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleVerifyEmail = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in again.');
      setOpenSnackbar(true);
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id;
      const response = await axios.post(`${API_URL}/api/auth/send-verify-otp`, { userId }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setSuccessMessage('Verification email sent!');
      }
    } catch (err) {
      setError('Failed to send verification email');
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in again.');
      setOpenSnackbar(true);
      return;
    }
    if (window.confirm('Are you sure you want to delete your profile?')) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        const response = await axios.delete(`${API_URL}/api/auth/delete-user/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setSuccessMessage('Profile deleted successfully!');
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
          window.location.href = '/';
        }
      } catch (err) {
        setError('Failed to delete profile');
      } finally {
        setOpenSnackbar(true);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setError('');
    setSuccessMessage('');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return null;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Box sx={{ maxWidth: 800, mx: 'auto', px: 2 }}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h4" gutterBottom>Customer Profile</Typography>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" fontWeight="bold">Full Name:</Typography>
                {isEditing ? (
                  <TextField
                    name="fullName"
                    value={user.fullName}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    sx={{ mt: 1 }}
                  />
                ) : (
                  <Typography variant="body1">{user.fullName}</Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body1" fontWeight="bold">Email:</Typography>
                <Typography variant="body1">{user.email}</Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body1" fontWeight="bold">Phone:</Typography>
                {isEditing ? (
                  <TextField
                    name="phone"
                    value={user.phone}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    sx={{ mt: 1 }}
                  />
                ) : (
                  <Typography variant="body1">{user.phone}</Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body1" fontWeight="bold">Email Verified:</Typography>
                <Typography variant="body1">{user.isAccountVerified ? 'Yes' : 'No'}</Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Box display="flex" flexWrap="wrap" justifyContent="space-between" gap={2}>

              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleVerifyEmail}
                  disabled={user.isAccountVerified}
                  sx={{ mr: 1, mb: 1 }}
                >
                  {user.isAccountVerified ? 'Email Verified' : 'Verify Email'}
                </Button>
              </Box>

              <Box>
                {isEditing ? (
                  <>
                    <Button variant="contained" color="primary" onClick={handleUpdate} sx={{ mr: 1, mb: 1 }}>Save</Button>
                    <Button variant="outlined" color="secondary" onClick={() => setIsEditing(false)} sx={{ mb: 1 }}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button variant="contained" onClick={() => setIsEditing(true)} sx={{ mr: 1, mb: 1 }}>Edit</Button>
                    <Button variant="contained" color="secondary" onClick={handleDelete} sx={{ mr: 1, mb: 1 }}>Delete</Button>
                  </>
                )}
              </Box>

              {/* New Booking History Button */}
              <Box>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate('/booking-history')}
                  sx={{ mb: 1 }}
                >
                  Booking History
                </Button>
              </Box>

            </Box>

          </CardContent>
        </Card>
      </Box>

      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        {error ? (
          <Alert severity="error" onClose={handleCloseSnackbar}>{error}</Alert>
        ) : (
          <Alert severity="success" onClose={handleCloseSnackbar}>{successMessage}</Alert>
        )}
      </Snackbar>
    </Box>
  );
};

export default CustomerProfile;
