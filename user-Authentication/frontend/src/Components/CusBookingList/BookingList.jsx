import React, { useState } from 'react';
import './BookingList.css';

const initialBookings = [
  { id: 1, service: "Home Cleaning", date: "2025-05-01", time: "10:00 AM", status: "Confirmed", serviceProvider: "John Doe" },
  { id: 2, service: "Plumbing", date: "2025-05-03", time: "2:00 PM", status: "Pending", serviceProvider: "Jane Smith" },
  { id: 3, service: "Electric", date: "2025-05-05", time: "9:00 AM", status: "Completed", serviceProvider: "David Johnson" },
];

function BookingList() {
  const [bookings, setBookings] = useState(initialBookings);

  const handleStatusChange = (id, newStatus) => {
    const updatedBookings = bookings.map((booking) => 
      booking.id === id ? { ...booking, status: newStatus } : booking
    );
    setBookings(updatedBookings);
  };

  return (
    <div className="booking-list-container">
      <h1>My Bookings</h1>
      <table className="booking-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Service</th>
            <th>Service Provider</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.id}</td>
              <td>{booking.service}</td>
              <td>{booking.serviceProvider}</td>
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

export default BookingList;
