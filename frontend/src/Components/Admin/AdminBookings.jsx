import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminBookings.css";

const API_URL = 'http://localhost:4000';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [error, setError] = useState("");

  const servicePrices = {
    cleaning: 1100,
    plumbing: 1600,
    painting: 1800,
    repairing: 1200,
    electrician: 1700,
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/bookings`);
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings", err);
    }
  };

  const deleteBooking = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      try {
        await axios.delete(`${API_URL}/api/bookings/${id}`);
        fetchBookings();
        alert("Booking deleted successfully");
      } catch (err) {
        console.error("Error deleting booking", err);
      }
    }
  };

  const startEditing = (booking) => {
    setEditingBookingId(booking._id);
    setEditFormData({ ...booking });
  };

  const cancelEditing = () => {
    setEditingBookingId(null);
    setEditFormData({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveUpdate = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^07\d{8}$/;

    if (
      !editFormData.customerName ||
      !editFormData.email ||
      !editFormData.phone ||
      !editFormData.address ||
      !editFormData.provider ||
      !editFormData.date ||
      editFormData.startTime === null ||
      editFormData.endTime === null
    ) {
      alert("Please complete all required fields.");
      return;
    }
    if (!emailRegex.test(editFormData.email)) {
      alert("Invalid email format.");
      return;
    }
    if (!phoneRegex.test(editFormData.phone)) {
      alert("Phone must be in Sri Lankan format: 07XXXXXXXX");
      return;
    }

    try {
      const totalHours = editFormData.endTime - editFormData.startTime;
      const serviceTypeLower = editFormData.serviceType?.toLowerCase();
      const pricePerHour = servicePrices[serviceTypeLower] || 0;
      const newPrice = totalHours * pricePerHour;

      const updatedBooking = {
        ...editFormData,
        totalHours,
        price: newPrice,
      };

      await axios.put(`${API_URL}/api/bookings/${editingBookingId}`, updatedBooking);
      setEditingBookingId(null);
      fetchBookings();
      alert("Booking updated successfully");
    } catch (err) {
      setError("Failed to update booking");
    }
  };

  return (
    <div className="admin-bookings-container">
      <h2>Manage Bookings</h2>
      {error && <div className="error-message">{error}</div>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Service Type</th>
              <th>Provider</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Total Hours</th>
              <th>Price (LKR)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                {editingBookingId === booking._id ? (
                  <>
                    <td><input name="customerName" value={editFormData.customerName} onChange={handleEditChange} /></td>
                    <td><input name="email" value={editFormData.email} onChange={handleEditChange} /></td>
                    <td><input name="phone" value={editFormData.phone} onChange={handleEditChange} /></td>
                    <td><input name="address" value={editFormData.address} onChange={handleEditChange} /></td>
                    <td>
                      <select name="serviceType" value={editFormData.serviceType} onChange={handleEditChange}>
                        <option value="">Select a service</option>
                        <option value="cleaning">Cleaning</option>
                        <option value="plumbing">Plumbing</option>
                        <option value="painting">Painting</option>
                        <option value="repairing">Repairing</option>
                        <option value="electrician">Electrician</option>
                      </select>
                    </td>
                    <td><input name="provider" value={editFormData.provider} onChange={handleEditChange} /></td>
                    <td><input type="date" name="date" value={editFormData.date} onChange={handleEditChange} /></td>
                    <td><input type="number" name="startTime" value={editFormData.startTime} onChange={handleEditChange} min="0" max="23" /></td>
                    <td><input type="number" name="endTime" value={editFormData.endTime} onChange={handleEditChange} min="1" max="24" /></td>
                    <td>{editFormData.endTime - editFormData.startTime}</td>
                    <td>{(editFormData.endTime - editFormData.startTime) * (servicePrices[editFormData.serviceType?.toLowerCase()] || 0)}</td>
                    <td>
                      <button className="save-btn" onClick={saveUpdate}>Save</button>
                      <button className="cancel-btn" onClick={cancelEditing}>Cancel</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{booking.customerName}</td>
                    <td>{booking.email}</td>
                    <td>{booking.phone}</td>
                    <td>{booking.address}</td>
                    <td>{booking.serviceType}</td>
                    <td>{booking.provider}</td>
                    <td>{booking.date}</td>
                    <td>{booking.startTime}:00</td>
                    <td>{booking.endTime}:00</td>
                    <td>{booking.totalHours}</td>
                    <td>{booking.price}</td>
                    <td>
                      <button className="edit-btn" onClick={() => startEditing(booking)}>Edit</button>
                      <button className="delete-btn" onClick={() => deleteBooking(booking._id)}>Delete</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookings;
