import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Services.css';

const Services = () => {
  const navigate = useNavigate();

  const services = [
    { name: 'Cleaning', description: 'Professional house and office cleaning services.', price: 'Rs. 1,100 per hour' },
    { name: 'Plumbing', description: 'Reliable plumbing solutions for your home and office.', price: 'Rs. 1,600 per hour' },
    { name: 'Painting', description: 'High-quality painting services for interiors and exteriors.', price: 'Rs. 1,800 per hour' },
    { name: 'Repairing', description: 'Expert repair services for household appliances and furniture.', price: 'Rs. 1,200 per hour' },
    { name: 'Electrician', description: 'Certified electricians for all types of electrical works.', price: 'Rs. 1,700 per hour' },
  ];

  const handleSelectService = (serviceName) => {
    const token = localStorage.getItem('token');

    if (!token) {
      if (window.confirm('Please log in first to view available providers. Do you want to log in now?')) {
        navigate('/login');
      }
      return;
    }

    navigate(`/services/${serviceName.toLowerCase()}`);
  };

  return (
    <div className="services-container">
      <h1 className="services-title">Our Services</h1>
      <div className="services-grid">
        {services.map((service, index) => (
          <div 
            key={index} 
            className="service-card"
            onClick={() => handleSelectService(service.name)}
          >
            <h2 className="service-name">{service.name}</h2>
            <p className="service-description">{service.description}</p>
            <p className="service-price">Starting at {service.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
