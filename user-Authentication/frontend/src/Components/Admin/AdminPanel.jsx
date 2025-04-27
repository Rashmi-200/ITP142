import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const API_URL = 'http://localhost:4000'; // Adjust to your backend URL

const AdminPanel = () => {
  const [serviceProviders, setServiceProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServiceProviders();
  }, []);

  const fetchServiceProviders = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/serviceProvider/auth/all`); // No token
      if (response.data.success) {
        setServiceProviders(response.data.serviceProviders);
        setFilteredProviders(response.data.serviceProviders);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch service providers');
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = serviceProviders.filter(provider =>
      provider.fullName.toLowerCase().includes(term)
    );
    setFilteredProviders(filtered);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service provider?')) {
      try {
        const response = await axios.delete(`${API_URL}/api/serviceProvider/auth/delete/${id}`); // No token
        if (response.data.success) {
          setServiceProviders(serviceProviders.filter(provider => provider.id !== id));
          setFilteredProviders(filteredProviders.filter(provider => provider.id !== id));
          alert('Service provider deleted successfully');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete service provider');
      }
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'verified' : currentStatus === 'verified' ? 'rejected' : 'pending';
    try {
      const response = await axios.put(
        `${API_URL}/api/serviceProvider/auth/toggle-status/${id}`,
        { status: newStatus }
      ); // No token
      if (response.data.success) {
        const updatedProviders = serviceProviders.map(provider =>
          provider.id === id ? { ...provider, status: newStatus } : provider
        );
        setServiceProviders(updatedProviders);
        setFilteredProviders(updatedProviders.filter(provider =>
          provider.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        ));
        alert('Status updated successfully');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/serviceProvider/auth/report`, {
        responseType: 'blob', // For file download
      }); // No token
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'service_providers_report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to download report');
    }
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel - Service Providers</h2>
      {error && <p className="error">{error}</p>}

      <div className="controls">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <button onClick={handleDownloadReport} className="download-btn">
          Download Report
        </button>
      </div>

      <table className="provider-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Service Type</th>
            <th>Experience</th>
            <th>Status</th>
            <th>Certification Verified</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProviders.map(provider => (
            <tr key={provider.id}>
              <td>{provider.fullName}</td>
              <td>{provider.email}</td>
              <td>{provider.phone}</td>
              <td>{provider.serviceType}</td>
              <td>{provider.experience}</td>
              <td>
                <select
                  value={provider.status}
                  onChange={(e) => handleStatusToggle(provider.id, provider.status)}
                  className={`status-${provider.status}`}
                >
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </td>
              <td>{provider.isCertificationVerified ? 'Yes' : 'Pending'}</td>
              <td>
                <button
                  onClick={() => handleDelete(provider.id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;