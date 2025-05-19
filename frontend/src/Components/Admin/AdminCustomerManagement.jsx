import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

const API_URL = 'http://localhost:4000';

const AdminCustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editCustomerId, setEditCustomerId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/auth/users/all`);
      const users = response.data.users || [];
      setCustomers(users);
      setFilteredCustomers(users);
    } catch (err) {
      setError('Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const term = searchTerm.toLowerCase();
    const filtered = customers.filter(customer =>
      customer.fullName.toLowerCase().includes(term)
    );
    setFilteredCustomers(filtered);
  };

  const startEdit = (customer) => {
    setEditCustomerId(customer._id);
    setEditFormData({
      fullName: customer.fullName || '',
      phone: customer.phone || '',
    });
  };

  const cancelEdit = () => {
    setEditCustomerId(null);
    setEditFormData({});
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const saveUpdate = async () => {
    try {
      await axios.put(`${API_URL}/api/auth/update-user/${editCustomerId}`, editFormData);
      setEditCustomerId(null);
      fetchCustomers();
      alert('Customer updated successfully');
    } catch (err) {
      setError('Failed to update customer');
    }
  };

  const handleDelete = async (_id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;
    try {
      await axios.delete(`${API_URL}/api/auth/delete-user/${_id}`);
      fetchCustomers();
      alert('Customer deleted successfully');
    } catch (err) {
      setError('Failed to delete customer');
    }
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel - Customers</h2>
      {loading ? (
        <p>Loading customers...</p>
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
          </div>

          <table className="provider-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Account Verified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center' }}>No customers found</td></tr>
              ) : (
                filteredCustomers.map(customer => (
                  editCustomerId === customer._id ? (
                    <tr key={customer._id}>
                      <td>{customer._id?.slice(0, 6)}...{customer._id?.slice(-4)}</td>
                      <td><input name="fullName" value={editFormData.fullName} onChange={handleEditChange} /></td>
                      <td>{customer.email}</td>
                      <td><input name="phone" value={editFormData.phone} onChange={handleEditChange} /></td>
                      <td>{customer.isAccountVerified ? 'Yes' : 'No'}</td>
                      <td>
                        <div className="action-buttons">
                          <button onClick={saveUpdate} className="save-btn">Save</button>
                          <button onClick={cancelEdit} className="cancel-btn">Cancel</button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={customer._id}>
                      <td>{customer._id?.slice(0, 6)}...{customer._id?.slice(-4)}</td>
                      <td>{customer.fullName}</td>
                      <td>{customer.email}</td>
                      <td>{customer.phone}</td>
                      <td>{customer.isAccountVerified ? 'Yes' : 'No'}</td>
                      <td>
                        <div className="action-buttons">
                          <button onClick={() => handleDelete(customer._id)} className="delete-btn">Delete</button>
                          <button onClick={() => startEdit(customer)} className="edit-btn">Edit</button>
                        </div>
                      </td>
                    </tr>
                  )
                ))
              )}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AdminCustomerManagement;
