import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BookingHistory.css';
import { useNavigate } from 'react-router-dom';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const storedEmail = localStorage.getItem('userEmail');
  const navigate = useNavigate();

  useEffect(() => {
    if (storedEmail) {
      fetchBookings();
    }
  }, [storedEmail]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/bookings/history/${storedEmail}`);
      setBookings(res.data);
    } catch (error) {
      console.error('Error fetching booking history', error);
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.delete(`http://localhost:4000/api/bookings/${id}`);
        alert('Booking cancelled successfully.');
        fetchBookings();
      } catch (error) {
        console.error('Error cancelling booking', error);
      }
    }
  };

  const handleMakeComplaint = (booking) => {
    navigate('/addcomplaint', {
      state: {
        bookingId: booking._id,
        serviceName: booking.serviceType,
        serviceProvider: booking.provider,
        date: booking.date,
        location: booking.address,
      }
    });
  };

  const handleLeaveReview = (booking) => {
    navigate('/review', {
      state: {
        providerName: booking.provider,
        serviceType: booking.serviceType
      }
    });
  };

  return (
    <div className="booking-history-container">
      <h2>Your Booking History</h2>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="booking-list">
          {bookings.map((b) => (
            <div key={b._id} className="booking-card">
              <h3>{b.serviceType}</h3>
              <p><strong>Provider:</strong> {b.provider}</p>
              <p><strong>Date:</strong> {b.date}</p>
              <p><strong>Time:</strong> {b.startTime}:00 - {b.endTime}:00</p>
              <p><strong>Total Price:</strong> Rs {b.price}</p>
              <p><strong>Payment:</strong> {b.paymentStatus}</p>
              <p><strong>Status:</strong> {b.bookingStatus || 'Active'}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' }}>
                <button onClick={() => handleCancelBooking(b._id)} style={{ padding: '10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                  Cancel Booking
                </button>
                <button onClick={() => handleMakeComplaint(b)} style={{ padding: '10px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                  Make a Complaint
                </button>
                <button onClick={() => handleLeaveReview(b)} style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                  Leave a Review
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
