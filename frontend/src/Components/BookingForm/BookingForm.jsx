import React, { useState, useEffect } from "react";
import axios from "axios";
import "./BookingForm.css";
import { useNavigate, useLocation } from 'react-router-dom';

const BookingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { serviceType: selectedServiceType, providerName: selectedProviderName } = location.state || {};

  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [provider, setProvider] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [totalHours, setTotalHours] = useState(0);
  const [price, setPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);

  const servicePrices = {
    cleaning: 1100,
    plumbing: 1600,
    painting: 1800,
    repairing: 1200,
    electrician: 1700,
  };

  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (userEmail) setEmail(userEmail);
    if (selectedServiceType) setServiceType(selectedServiceType);
    if (selectedProviderName) setProvider(selectedProviderName);
  }, [selectedServiceType, selectedProviderName]);

  useEffect(() => {
    if (startTime !== null && endTime !== null && startTime < endTime && serviceType) {
      const hours = endTime - startTime;
      setTotalHours(hours);
      const pricePerHour = servicePrices[serviceType.toLowerCase()] || 0;
      setPrice(pricePerHour * hours);
    }
  }, [startTime, endTime, serviceType]);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (provider && serviceType && date) {
        try {
          const res = await axios.get(`http://localhost:4000/api/bookings/availability?provider=${provider}&serviceType=${serviceType}&date=${date}`);
          setBookedSlots(res.data || []);
        } catch (error) {
          console.error("Error fetching availability", error);
        }
      }
    };
    fetchAvailability();
  }, [provider, serviceType, date]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    const bookingData = {
      customerName,
      email,
      phone,
      address,
      serviceType,
      provider,
      date,
      startTime,
      endTime,
      totalHours,
      price,
      cardNumber,
      expiry,
      cvv,
    };

    try {
      await axios.post("http://localhost:4000/api/bookings", bookingData);
      alert("Booking successful!");
      navigate('/booking-history');
    } catch (error) {
      console.error("Booking failed", error);
      setErrorMessage("Booking failed. Please try again.");
    }
  };

  const validateInputs = () => {
    const phoneRegex = /^07\d{8}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cardRegex = /^\d{16}$/;
    const cvvRegex = /^\d{3}$/;
    const expiryRegex = /^(0[1-9]|1[0-2])\/(\d{2})$/;

    if (!customerName || !email || !phone || !address || !provider || !date || startTime === null || endTime === null || !cardNumber || !expiry || !cvv) {
      setErrorMessage("Please complete all fields.");
      return false;
    }
    if (!emailRegex.test(email)) {
      setErrorMessage("Invalid email format.");
      return false;
    }
    if (!phoneRegex.test(phone)) {
      setErrorMessage("Phone must be in Sri Lankan format: 07XXXXXXXX");
      return false;
    }
    if (!cardRegex.test(cardNumber.replace(/\s+/g, ''))) {
      setErrorMessage("Card number must be 16 digits.");
      return false;
    }
    if (!expiryRegex.test(expiry)) {
      setErrorMessage("Expiry must be in MM/YY format.");
      return false;
    }
    if (!cvvRegex.test(cvv)) {
      setErrorMessage("CVV must be 3 digits.");
      return false;
    }
    return true;
  };

  const renderTimeSlots = () => {
    return [...Array(24).keys()].map((hour) => {
      const isBooked = bookedSlots.some(slot => hour >= slot.startTime && hour < slot.endTime);
      return (
        <button
          type="button"
          key={hour}
          className={`slot ${isBooked ? 'booked' : (startTime !== null && endTime !== null && hour >= startTime && hour <= endTime ? 'selected' : 'available')}`}
          disabled={isBooked}
          onClick={() => !isBooked && handleSlotClick(hour)}
        >
          {hour}:00
        </button>
      );
    });
  };

  const handleSlotClick = (hour) => {
    if (startTime === null || (startTime !== null && endTime !== null)) {
      setStartTime(hour);
      setEndTime(null);
    } else if (hour > startTime) {
      setEndTime(hour);
    } else {
      setStartTime(hour);
      setEndTime(null);
    }
  };

  return (
    <div className="booking-form">
      <h2>Book a Service</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>

        <label>Name</label>
        <input
          placeholder="e.g., John Doe"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          value={email}
          readOnly
        />

        <label>Phone</label>
        <input
          placeholder="e.g., 0771234567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <label>Address</label>
        <input
          placeholder="e.g., No. 123, Galle Road, Colombo"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />

        <label>Service Type</label>
        <input
          value={serviceType}
          readOnly
        />

        <label>Provider</label>
        <input
          value={provider}
          readOnly
        />

        <label>Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          required
        />

        <label>Select Time Slots</label>
        <div className="time-slots-container">
          {renderTimeSlots()}
        </div>

        <div className="booking-summary">
          <p>Total Hours: {totalHours}</p>
          <p>Total Price: LKR {price}</p>
        </div>

        <h3>Payment Details</h3>

        <label>Card Number</label>
        <input
          placeholder="e.g., 1234567812345678"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          required
        />

        <label>Expiry (MM/YY)</label>
        <input
          placeholder="e.g., 08/26"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
          required
        />

        <label>CVV</label>
        <input
          placeholder="e.g., 123"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          required
        />

        <button type="submit" className="submit-button">
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookingForm;
