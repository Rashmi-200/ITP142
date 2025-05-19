import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css'; // AdminNavbar import removed

const API_URL = 'http://localhost:4000';

const AdminDashboard = () => {
  const [providerCount, setProviderCount] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);

  useEffect(() => {
    fetchProviderCount();
    fetchCustomerCount();
  }, []);

  const fetchProviderCount = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/serviceProvider/auth/all`);
      if (res.data.success) {
        setProviderCount(res.data.serviceProviders.length);
      }
    } catch (err) {
      console.error('Error fetching providers:', err);
    }
  };

  const fetchCustomerCount = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/auth/users/all`);
      if (res.data.success) {
        setCustomerCount(res.data.users.length);
      }
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Removed <AdminNavbar /> from here */}

      <div className="dashboard-header">
        <h1>Welcome Admin!</h1>
        <p>Here is a summary of the system status:</p>
      </div>

      <div className="dashboard-cards">
        <div className="card">
          <h2>{providerCount}</h2>
          <p>Service Providers</p>
        </div>
        <div className="card">
          <h2>{customerCount}</h2>
          <p>Customers</p>
        </div>
        <div className="card">
          <h2>0</h2>
          <p>Bookings (Coming Soon)</p>
        </div>
        <div className="card">
          <h2>0</h2>
          <p>Complaints (Coming Soon)</p>
        </div>
        <div className="card">
          <h2>0</h2>
          <p>Reviews (Coming Soon)</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
