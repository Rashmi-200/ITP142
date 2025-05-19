import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ComplaintManagement.css';

const ComplaintManagement = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/complaints');
      setComplaints(res.data.complaints);
    } catch (error) {
      console.error('Failed to fetch complaints:', error);
      alert('Failed to fetch complaints. Please check console for details.');
    }
  };

  const handleStatusUpdate = async (id, currentStatus) => {
    const newStatus = currentStatus === 'In Progress' ? 'Completed' : 'In Progress';
    try {
      await axios.put(`http://localhost:4000/api/complaints/${id}`, { Status: newStatus });
      fetchComplaints();
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status. Please check console for details.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this complaint?")) {
      try {
        await axios.delete(`http://localhost:4000/api/complaints/${id}`);
        fetchComplaints();
      } catch (error) {
        console.error('Failed to delete complaint:', error);
        alert('Failed to delete complaint. Please check console for details.');
      }
    }
  };

  const formatComplaintId = (id) => {
    // Use the complaintid if it exists, otherwise use MongoDB _id
    return id.complaintid ? id.complaintid : `CMP-${id._id.slice(-4).toUpperCase()}`;
  };

  return (
    <div className="complaint-management-container">
      <h2>Complaint Management</h2>
      <table>
        <thead>
          <tr>
            <th>Complaint ID</th>
            <th>Service</th>
            <th>Provider</th>
            <th>Date</th>
            <th>Category</th>
            <th>Urgency</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <tr key={c._id}>
              <td>{formatComplaintId(c)}</td>
              <td>{c.serviceName}</td>
              <td>{c.serviceProvider}</td>
              <td>{new Date(c.date).toLocaleDateString()}</td>
              <td>{c.complaintCategory}</td>
              <td>{c.urgencyLevel}</td>
              <td style={{ color: c.Status === "Completed" ? "green" : "orange", fontWeight: "bold" }}>
                {c.Status}
              </td>
              <td>
                <button onClick={() => handleStatusUpdate(c._id, c.Status)}>
                  {c.Status === "In Progress" ? "Mark Completed" : "Reopen"}
                </button>
                <button onClick={() => handleDelete(c._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComplaintManagement;