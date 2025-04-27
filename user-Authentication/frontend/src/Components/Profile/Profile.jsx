import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Alert,
  CircularProgress,
  Snackbar,
  Divider,
  Grid
} from '@mui/material';
import { Edit, Delete, Save, Cancel, Add, Remove } from '@mui/icons-material';
import Footer from '../footer/footer';




const API_URL = 'http://localhost:4000'; // Adjust to backend URL

const Profile = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // File input ref (for service provider certifications)
  const fileInputRef = useRef(null);

  const userType = localStorage.getItem('userType') || 'customer';

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view your profile');
        navigate('/login');
        return;
      }
      try {
        setLoading(true);
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        const endpoint =
          userType === 'customer'
            ? `${API_URL}/api/auth/users/data/${userId}`
            : `${API_URL}/api/serviceProvider/auth/data/${userId}`;

        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.success) {
          const dataKey = userType === 'customer' ? 'user' : 'serviceProvider';
          setUser(response.data[dataKey]);
        } else {
          setError(response.data.message);
          navigate('/login');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, userType]);

  // Handle changes for text fields
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle availability changes (for service providers)
  const handleAvailabilityChange = (index, field, value) => {
    const updatedAvailability = [...user.availability];
    updatedAvailability[index] = { ...updatedAvailability[index], [field]: value };
    setUser({ ...user, availability: updatedAvailability });
  };

  const addAvailabilitySlot = () => {
    setUser({
      ...user,
      availability: [...(user.availability || []), { day: '', startTime: '', endTime: '' }],
    });
  };

  const removeAvailabilitySlot = (index) => {
    const updatedAvailability = user.availability.filter((_, i) => i !== index);
    setUser({ ...user, availability: updatedAvailability });
  };

  // Handle profile update
  const handleUpdate = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to update your profile');
      setOpenSnackbar(true);
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id;
      const endpoint =
        userType === 'customer'
          ? `${API_URL}/api/auth/update-user/${userId}`
          : `${API_URL}/api/serviceProvider/update/${userId}`;

      const dataToSend =
        userType === 'customer'
          ? {
              fullName: user.fullName,
              phone: user.phone,
              address: user.address,
            }
          : {
              fullName: user.fullName,
              phone: user.phone,
              address: user.address,
              serviceType: user.serviceType,
              experience: Number(user.experience),
              availability: user.availability,
            };

      const response = await axios.put(endpoint, dataToSend, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setUser(response.data.updatedServiceProvider || response.data.user || user);
        setSuccessMessage('Profile updated successfully!');
        setOpenSnackbar(true);
        setIsEditing(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
      setOpenSnackbar(true);
    }
  };

  // Handle profile deletion
  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to delete your profile');
      setOpenSnackbar(true);
      return;
    }
    if (window.confirm('Are you sure you want to delete your profile?')) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        const endpoint =
          userType === 'customer'
            ? `${API_URL}/api/auth/delete-user/${userId}`
            : `${API_URL}/api/serviceProvider/auth/delete/${userId}`;

        const response = await axios.delete(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data.success) {
          setSuccessMessage('Profile deleted successfully!');
          setOpenSnackbar(true);
          localStorage.removeItem('token');
          localStorage.removeItem('userType');
          navigate('/');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Deletion failed');
        setOpenSnackbar(true);
      }
    }
  };

  // Handle Verify Email — works for both customer and service provider
  const handleVerifyEmail = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to verify your email');
      setOpenSnackbar(true);
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id;
      const endpoint =
        userType === 'customer'
          ? `${API_URL}/api/auth/send-verify-otp`
          : `${API_URL}/api/serviceProvider/auth/send-verify-otp`;
      const payload = userType === 'customer' ? { userId } : {};
      const response = await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.data.success) {
        setSuccessMessage('Email verification OTP has been sent!');
        setOpenSnackbar(true);
        localStorage.setItem('userType', userType);
        navigate('/verifyEmail', {
          state: { email: user.email, userId: userId },
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
      setOpenSnackbar(true);
    }
  };

  // Handle file input change for certifications (for service providers only)
  const handleCertificationUpload = async (e) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to upload certifications');
      setOpenSnackbar(true);
      return;
    }
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('certification', file);

    try {
      setUploading(true);
      // Assuming your upload endpoint for certifications is:
      // POST /api/serviceProvider/upload-certifications
      const response = await axios.post(
        `${API_URL}/api/serviceProvider/auth/upload-certifications`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      if (response.data.success) {
        // Update user certificationProofs with the returned URL (assumed to be in response.data.certificationUrl)
        const updatedCert = response.data.certificationUrl;
        setUser({
          ...user,
          certificationProofs: [...(user.certificationProofs || []), updatedCert],
        });
        setSuccessMessage('Certification uploaded successfully!');
        setOpenSnackbar(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Certification upload failed');
      setOpenSnackbar(true);
    } finally {
      setUploading(false);
    }
  };

  // Trigger hidden file input for adding certification (only for service providers)
  const handleAddCertificationClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle Snackbar close
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

  if (!user) {
    return null; // Redirect to login if user not loaded
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 4 }}>
      <Box sx={{ maxWidth: 800, mx: 'auto', px: 2 }}>
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {userType === 'customer' ? 'Customer Profile' : 'Service Provider Profile'}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              {/* Full Name */}
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" fontWeight="bold">
                  Full Name:
                </Typography>
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

              {/* Email */}
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" fontWeight="bold">
                  Email:
                </Typography>
                <Typography variant="body1">{user.email}</Typography>
              </Grid>

              {/* Phone Number */}
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" fontWeight="bold">
                  Phone Number:
                </Typography>
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

              {/* Address */}
              <Grid item xs={12} sm={6}>
                <Typography variant="body1" fontWeight="bold">
                  Address:
                </Typography>
                {isEditing ? (
                  <TextField
                    name="address"
                    value={user.address || ''}
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    sx={{ mt: 1 }}
                  />
                ) : (
                  <Typography variant="body1">{user.address || 'N/A'}</Typography>
                )}
              </Grid>

              {/* Customer-Specific Fields */}
              {userType === 'customer' && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" fontWeight="bold">
                    Email Verified:
                  </Typography>
                  <Typography variant="body1">{user.isAccountVerified ? 'Yes' : 'No'}</Typography>
                </Grid>
              )}

              {/* Service Provider-Specific Fields */}
              {userType !== 'customer' && (
                <>
                  {/* Service Type */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1" fontWeight="bold">
                      Service Type:
                    </Typography>
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

                  {/* Experience */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1" fontWeight="bold">
                      Experience:
                    </Typography>
                    {isEditing ? (
                      <TextField
                        type="number"
                        name="experience"
                        value={user.experience}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    ) : (
                      <Typography variant="body1">{`${user.experience} years`}</Typography>
                    )}
                  </Grid>

                  {/* Availability */}
                  <Grid item xs={12}>
                    <Typography variant="body1" fontWeight="bold">
                      Availability:
                    </Typography>
                    {isEditing ? (
                      <Box sx={{ mt: 1 }}>
                        {user.availability?.map((slot, index) => (
                          <Box key={index} display="flex" alignItems="center" mb={2}>
                            <FormControl sx={{ minWidth: 120, mr: 2 }}>
                              <InputLabel>Day</InputLabel>
                              <Select
                                value={slot.day}
                                onChange={(e) => handleAvailabilityChange(index, 'day', e.target.value)}
                                label="Day"
                              >
                                <MenuItem value="">Select Day</MenuItem>
                                <MenuItem value="Monday">Monday</MenuItem>
                                <MenuItem value="Tuesday">Tuesday</MenuItem>
                                <MenuItem value="Wednesday">Wednesday</MenuItem>
                                <MenuItem value="Thursday">Thursday</MenuItem>
                                <MenuItem value="Friday">Friday</MenuItem>
                                <MenuItem value="Saturday">Saturday</MenuItem>
                                <MenuItem value="Sunday">Sunday</MenuItem>
                              </Select>
                            </FormControl>
                            <TextField
                              type="time"
                              value={slot.startTime}
                              onChange={(e) => handleAvailabilityChange(index, 'startTime', e.target.value)}
                              sx={{ mr: 2 }}
                              size="small"
                            />
                            <TextField
                              type="time"
                              value={slot.endTime}
                              onChange={(e) => handleAvailabilityChange(index, 'endTime', e.target.value)}
                              sx={{ mr: 2 }}
                              size="small"
                            />
                            {index > 0 && (
                              <IconButton color="secondary" onClick={() => removeAvailabilitySlot(index)}>
                                <Remove />
                              </IconButton>
                            )}
                          </Box>
                        ))}
                        <Button variant="outlined" startIcon={<Add />} onClick={addAvailabilitySlot} sx={{ mt: 1 }}>
                          Add Availability Slot
                        </Button>
                      </Box>
                    ) : user.availability && user.availability.length > 0 ? (
                      <Typography variant="body1">
                        {user.availability
                          .map((slot) => `${slot.day}: ${slot.startTime} - ${slot.endTime}`)
                          .join(', ')}
                      </Typography>
                    ) : (
                      <Typography variant="body1">N/A</Typography>
                    )}
                  </Grid>

                  

                  

                  {/* Email Verified */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1" fontWeight="bold">
                      Email Verified:
                    </Typography>
                    <Typography variant="body1">{user.isAccountVerified ? 'Yes' : 'No'}</Typography>
                  </Grid>

                  {/* Add Certifications Button – Shown ONLY for Service Providers */}
                  <Grid item xs={12} sm={6}>
                    <Button variant="contained" color="primary" onClick={handleAddCertificationClick}>
                       Add Certifications
                    </Button>
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      ref={fileInputRef}
                      style={{ display: 'none' }}
                      onChange={handleCertificationUpload }
                    />
                    {uploading && <CircularProgress size={24} />}
                  </Grid>

                  {/* Status */}
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1" fontWeight="bold">
                      Status:
                    </Typography>
                    <Typography variant="body1">{user.status || 'pending'}</Typography>
                  </Grid>
                </>
              )}
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Action Buttons */}
            <Box display="flex" justifyContent="space-between">
              <Box>
                {user.isAccountVerified ? (
                  <Button variant="contained" disabled>
                    Email Verified
                  </Button>
                ) : (
                  <Button variant="contained" color="primary" onClick={handleVerifyEmail}>
                    Verify Email
                  </Button>
                )}
              </Box>
              <Box>
                {isEditing ? (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Save />}
                      onClick={handleUpdate}
                      sx={{ mr: 1 }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      startIcon={<Cancel />}
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Edit />}
                      onClick={() => setIsEditing(true)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<Delete />}
                      onClick={handleDelete}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Snackbar for Success/Error Messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        {error ? (
          <Alert severity="error" onClose={handleCloseSnackbar}>
            {error}
          </Alert>
        ) : (
          <Alert severity="success" onClose={handleCloseSnackbar}>
            {successMessage}
          </Alert>
        )}
      </Snackbar>

      
    </Box>
  );
};

export default Profile;
