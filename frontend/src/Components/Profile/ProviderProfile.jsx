import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';
import { jwtDecode } from 'jwt-decode';
import { Box, Card, CardContent, Typography, TextField, Button, CircularProgress, Snackbar, Alert, Divider, Grid } from '@mui/material';

const API_URL = 'http://localhost:4000';

const ProviderProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const fileInputRef = useRef(null);
  const [certifications, setCertifications] = useState([]);

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
      const response = await axios.get(`${API_URL}/api/serviceProvider/auth/data/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setUser(response.data.serviceProvider);
        setCertifications(response.data.serviceProvider.certificationProofs || []);
      } else {
        navigate('/login');
      }
    } catch (err) {
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      const response = await axios.put(`${API_URL}/api/serviceProvider/update/${userId}`, {
        fullName: user.fullName,
        phone: user.phone,
        address: user.address,
        serviceType: user.serviceType,
        experience: Number(user.experience),
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
      const response = await axios.post(`${API_URL}/api/serviceProvider/auth/send-verify-otp`, { userId }, {
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
        const response = await axios.delete(`${API_URL}/api/serviceProvider/delete/${userId}`, {
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

  const handleCertificationUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('certification', file);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/api/serviceProvider/auth/upload-certifications`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccessMessage('Certification uploaded successfully!');
      fetchProfile();
    } catch (err) {
      setError('Failed to upload certification');
    } finally {
      setOpenSnackbar(true);
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
            <Typography variant="h4" gutterBottom>Service Provider Profile</Typography>

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
                <Typography variant="body1" fontWeight="bold">Address:</Typography>
                {isEditing ? (
                  <TextField
                    name="address"
                    value={user.address}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    sx={{ mt: 1 }}
                  />
                ) : (
                  <Typography variant="body1">{user.address}</Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body1" fontWeight="bold">Service Type:</Typography>
                {isEditing ? (
                  <TextField
                    name="serviceType"
                    value={user.serviceType}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    sx={{ mt: 1 }}
                  />
                ) : (
                  <Typography variant="body1">{user.serviceType}</Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body1" fontWeight="bold">Experience:</Typography>
                {isEditing ? (
                  <TextField
                    name="experience"
                    type="number"
                    value={user.experience}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    sx={{ mt: 1 }}
                  />
                ) : (
                  <Typography variant="body1">{user.experience} years</Typography>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="body1" fontWeight="bold">Email Verified:</Typography>
                <Typography variant="body1">{user.isAccountVerified ? 'Yes' : 'No'}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1" fontWeight="bold">Upload Certification:</Typography>
                <input type="file" onChange={handleCertificationUpload} accept="application/pdf,image/*" style={{ marginTop: '10px' }} />
                <Box mt={2}>
                  {certifications.length > 0 && certifications.map((cert, index) => (
                    <Typography key={index} variant="body2">{cert}</Typography>
                  ))}
                </Box>
              </Grid>

            </Grid>

            <Divider sx={{ my: 3 }} />

            <Box display="flex" justifyContent="space-between">
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleVerifyEmail}
                  disabled={user.isAccountVerified}
                  sx={{ mr: 1 }}
                >
                  {user.isAccountVerified ? 'Email Verified' : 'Verify Email'}
                </Button>
              </Box>
              <Box>
                {isEditing ? (
                  <>
                    <Button variant="contained" color="primary" onClick={handleUpdate} sx={{ mr: 1 }}>Save</Button>
                    <Button variant="outlined" color="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                  </>
                ) : (
                  <>
                    <Button variant="contained" onClick={() => setIsEditing(true)} sx={{ mr: 1 }}>Edit</Button>
                    <Button variant="contained" color="secondary" onClick={handleDelete}>Delete</Button>
                  </>
                )}
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

export default ProviderProfile;
