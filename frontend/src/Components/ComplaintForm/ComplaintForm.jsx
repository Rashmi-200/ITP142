import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './ComplaintForm.css';

const ComplaintForm = () => {
  const location = useLocation();
  const prefilledData = location.state || {};

  const [formData, setFormData] = useState({
    serviceName: prefilledData.serviceName || '',
    serviceProvider: prefilledData.serviceProvider || '',
    date: prefilledData.date ? new Date(prefilledData.date).toISOString().split('T')[0] : '',
    location: prefilledData.location || '',
    bookingId: prefilledData.bookingId || '',
    contactnumber: prefilledData.contactnumber || '',
    complaintCategory: prefilledData.complaintCategory || '',
    urgencyLevel: prefilledData.urgencyLevel || '',
    description: prefilledData.description || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Remove complaintid generation since backend will handle it
      await axios.post('http://localhost:4000/api/complaints', formData);
      alert('Complaint submitted successfully.');
      setFormData({
        serviceName: '',
        serviceProvider: '',
        date: '',
        location: '',
        bookingId: '',
        contactnumber: '',
        complaintCategory: '',
        urgencyLevel: '',
        description: '',
      });
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert('Error submitting complaint. Please check console for details.');
    }
  };

  return (
    <div className="complaint-form-container">
      <h2>Submit a Complaint</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="serviceName"
          value={formData.serviceName}
          onChange={handleChange}
          placeholder="Service Name"
          required
          readOnly={!!prefilledData.serviceName}
        />
        <input
          type="text"
          name="serviceProvider"
          value={formData.serviceProvider}
          onChange={handleChange}
          placeholder="Service Provider"
          required
          readOnly={!!prefilledData.serviceProvider}
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          placeholder="Date"
          required
          readOnly={!!prefilledData.date}
        />
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          required
          readOnly={!!prefilledData.location}
        />
        <input
          type="text"
          name="bookingId"
          value={formData.bookingId}
          onChange={handleChange}
          placeholder="Booking ID"
          required
          readOnly={!!prefilledData.bookingId}
        />
        <input
          type="number"
          name="contactnumber"
          value={formData.contactnumber}
          onChange={handleChange}
          placeholder="Contact Number"
          required
        />

        <select
          name="complaintCategory"
          value={formData.complaintCategory}
          onChange={handleChange}
          required
        >
          <option value="">Select Complaint Category</option>
          <option value="booking issues">Booking Issues</option>
          <option value="payment issues">Payment Issues</option>
          <option value="service quality issues">Service Quality Issues</option>
          <option value="notification error issues">Notification Error Issues</option>
          <option value="technical issues">Technical Issues</option>
          <option value="other issues">Other Issues</option>
        </select>

        <select
          name="urgencyLevel"
          value={formData.urgencyLevel}
          onChange={handleChange}
          required
        >
          <option value="">Select Urgency Level</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Complaint Description"
          rows="5"
          required
        ></textarea>

        <button type="submit">Submit Complaint</button>
      </form>
    </div>
  );
};

export default ComplaintForm;