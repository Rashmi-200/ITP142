import React from 'react';
import { Box, Typography, Card, CardContent, Grid, Button } from '@mui/material';

const ProviderDashboard = () => {
  const providerName = localStorage.getItem('providerName') || 'Service Provider';

  // Dummy stats for now (you can later connect real data)
  const stats = [
    { label: 'Completed Jobs', value: 15 },
    { label: 'Earnings', value: '$1200' },
    { label: 'Pending Requests', value: 3 },
  ];

  // Dummy job list
  const upcomingJobs = [
    { id: 1, customer: 'John Doe', service: 'Cleaning', date: '2025-05-01', time: '10:00 AM' },
    { id: 2, customer: 'Jane Smith', service: 'Repairing', date: '2025-05-02', time: '2:00 PM' },
    { id: 3, customer: 'Alice Johnson', service: 'Plumbing', date: '2025-05-03', time: '11:00 AM' },
  ];

  return (
    <div>
      <Box sx={{ padding: '40px', backgroundColor: '#f5f7fa', minHeight: 'calc(100vh - 200px)' }}>
        <Typography variant="h4" fontWeight="bold" mb={4}>
          Welcome, {providerName}!
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={5}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    {stat.label}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {stat.value}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Upcoming Jobs */}
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Upcoming Jobs
        </Typography>

        <Grid container spacing={3}>
          {upcomingJobs.map((job) => (
            <Grid item xs={12} md={6} key={job.id}>
              <Card elevation={2}>
                <CardContent>
                  <Typography variant="h6">{job.customer}</Typography>
                  <Typography variant="body1">Service: {job.service}</Typography>
                  <Typography variant="body2">Date: {job.date} at {job.time}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Update Availability Button */}
        <Box mt={5} textAlign="center">
          <Button variant="contained" color="primary" onClick={() => window.location.href='/profile'}>
            Update Availability
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default ProviderDashboard;
