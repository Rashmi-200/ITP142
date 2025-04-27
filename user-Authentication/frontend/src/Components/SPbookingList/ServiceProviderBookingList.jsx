import React, { useState } from 'react';
import './ServiceProviderBookingList.css';

const initialBookings = [
  { id: 1, customerName: "Alice", service: "Home Cleaning", date: "2025-05-01", time: "10:00 AM", status: "Confirmed" },
  { id: 2, customerName: "Bob", service: "Home Cleaning", date: "2025-05-03", time: "2:00 PM", status: "Pending" },
  { id: 3, customerName: "Charlie", service: "Home Cleaning", date: "2025-05-05", time: "9:00 AM", status: "Completed" },
];

function ServiceProviderBookingList() {
  const [bookings, setBookings] = useState(initialBookings);

  const handleStatusChange = (id, newStatus) => {
    const updatedBookings = bookings.map((booking) => 
      booking.id === id ? { ...booking, status: newStatus } : booking
    );
    setBookings(updatedBookings);
  };

  return (
    <div className="booking-list-container">
      <h1>My Customer Bookings</h1>
      <table className="booking-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Customer Name</th>
            <th>Service</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.id}</td>
              <td>{booking.customerName}</td>
              <td>{booking.service}</td>
              <td>{booking.date}</td>
              <td>{booking.time}</td>
              <td>
                <select
                  value={booking.status}
                  onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                  className={`status-dropdown ${booking.status.toLowerCase()}`}
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ServiceProviderBookingList;
