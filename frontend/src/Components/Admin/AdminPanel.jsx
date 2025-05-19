import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const API_URL = 'http://localhost:4000';

const AdminPanel = () => {
  const [serviceProviders, setServiceProviders] = useState([]);
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [editProviderId, setEditProviderId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchServiceProviders();
  }, []);

  const fetchServiceProviders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/serviceProvider/auth/all`);
      if (response.data.success) {
        const sortedProviders = response.data.serviceProviders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setServiceProviders(sortedProviders);
        setFilteredProviders(sortedProviders);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch service providers');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const term = searchTerm.toLowerCase();
    const filtered = serviceProviders.filter(provider =>
      provider.fullName.toLowerCase().includes(term)
    );
    setFilteredProviders(filtered);
  };

  const handleDelete = async (_id) => {
    if (!window.confirm('Are you sure you want to delete this service provider?')) return;
    try {
      await axios.delete(`${API_URL}/api/serviceProvider/auth/delete/${_id}`);
      fetchServiceProviders();
      alert('Service provider deleted successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete service provider');
    }
  };

  const handleStatusToggle = async (e, providerId) => {
    const newStatus = e.target.value;
    try {
      await axios.put(`${API_URL}/api/serviceProvider/auth/toggle-status/${providerId}`, { status: newStatus });
      fetchServiceProviders();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status');
    }
  };

  const startEdit = (provider) => {
    setEditProviderId(provider._id);
    setEditFormData({
      fullName: provider.fullName,
      phone: provider.phone,
      serviceType: provider.serviceType,
      experience: provider.experience,
    });
  };

  const cancelEdit = () => {
    setEditProviderId(null);
    setEditFormData({});
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const saveUpdate = async () => {
    try {
      await axios.put(`${API_URL}/api/serviceProvider/auth/update/${editProviderId}`, editFormData);
      setEditProviderId(null);
      fetchServiceProviders();
      alert('Provider updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update provider');
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/serviceProvider/auth/report`, { responseType: 'blob' });
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
      {loading ? (
        <p className="loading">Loading providers...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <div className="controls">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button onClick={handleSearch} className="search-btn">Search</button>
            <button onClick={handleDownloadReport} className="download-btn">
              Download Report
            </button>
          </div>

          <div className="table-wrapper">
            <table className="provider-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Service Type</th>
                  <th>Experience</th>
                  <th>Status</th>
                  <th>Certification Verified</th>
                  <th>Certifications</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProviders.map(provider => (
                  <tr key={provider._id}>
                    <td>{provider._id.slice(0, 6)}...{provider._id.slice(-4)}</td>
                    {editProviderId === provider._id ? (
                      <>
                        <td><input name="fullName" value={editFormData.fullName} onChange={handleEditChange} /></td>
                        <td>{provider.email}</td>
                        <td><input name="phone" value={editFormData.phone} onChange={handleEditChange} /></td>
                        <td>
                          <select name="serviceType" value={editFormData.serviceType} onChange={handleEditChange}>
                            <option value="Cleaning">Cleaning</option>
                            <option value="Plumbing">Plumbing</option>
                            <option value="Painting">Painting</option>
                            <option value="Repairing">Repairing</option>
                            <option value="Electrician">Electrician</option>
                          </select>
                        </td>
                        <td><input name="experience" type="number" value={editFormData.experience} onChange={handleEditChange} /></td>
                        <td>{provider.status}</td>
                        <td>{provider.isCertificationVerified ? 'Yes' : 'Pending'}</td>
                        <td>-</td>
                        <td>
                          <div className="action-buttons">
                            <button onClick={saveUpdate} className="save-btn">Save</button>
                            <button onClick={cancelEdit} className="cancel-btn">Cancel</button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{provider.fullName}</td>
                        <td>{provider.email}</td>
                        <td>{provider.phone}</td>
                        <td>{provider.serviceType}</td>
                        <td>{provider.experience}</td>
                        <td>
                          <select
                            value={provider.status}
                            onChange={(e) => handleStatusToggle(e, provider._id)}
                            className={`status-${provider.status}`}
                          >
                            <option value="pending">Pending</option>
                            <option value="verified">Verified</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                        <td>{provider.isCertificationVerified ? 'Yes' : 'Pending'}</td>
                        <td>
                          {provider.certificationProofs && provider.certificationProofs.length > 0 ? (
                            provider.certificationProofs.map((cert, index) => (
                              <div key={index}>
                                <a href={`http://localhost:4000/uploads/certifications/${cert}`} target="_blank" rel="noopener noreferrer">
                                  View {index + 1}
                                </a>
                              </div>
                            ))
                          ) : (
                            'No Certificate'
                          )}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button onClick={() => handleDelete(provider._id)} className="delete-btn">Delete</button>
                            <button onClick={() => startEdit(provider)} className="edit-btn">Edit</button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPanel;
