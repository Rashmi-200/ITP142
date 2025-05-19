import React, { useState } from 'react';
import './ContactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, phone, message } = formData;

    if (!name || !email || !phone || !message) {
      alert('Please fill out all fields.');
      return;
    }

    alert('Thank you for contacting Smart Home Care! We will get back to you shortly.');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contact Smart Home Care</h1>
        <p>Your trusted partner for a safer, smarter, and more comfortable home.</p>
      </div>

      <div className="contact-grid">
        {/* Contact Form */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <h2>Send Us a Message</h2>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your Message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit">Submit</button>
        </form>

        {/* Contact Info */}
        <div className="contact-info">
          <h2>Our Office</h2>
          <p><strong>Address:</strong> 456 Comfort Lane, HomeCity, HC 78910</p>
          <p><strong>Email:</strong> support@smarthomecare.com</p>
          <p><strong>Phone:</strong> +1 (800) 234-5678</p>
          <p><strong>Service Hours:</strong> Mon - Sat: 8:00 AM - 8:00 PM</p>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
