import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NewPage.css';  // Add the CSS file for the new page

const NewPage = () => {
  const navigate = useNavigate();

  const handleNavigateToCustomerSignUp = () => {
    navigate('/login?type=customer');  // Navigate to login with customer type
  };

  const handleNavigateToProviderSignUp = () => {
    navigate('/login?type=provider');  // Navigate to login with provider type
  };

  const handleNavigateToAdminRegister = () => {
    navigate('/admin/register');  // Navigate to Admin registration page
  };

  return (
    <div className="new-page-container">
      <h2>Choose Your Sign Up Option</h2>
      <p>Click below to sign up as a Customer, Service Provider, or Admin.</p>

      <div className="new-page-buttons">
        <button className="new-page-button" onClick={handleNavigateToCustomerSignUp}>
          Sign Up as Customer
        </button>
        <button className="new-page-button" onClick={handleNavigateToProviderSignUp}>
          Sign Up as Service Provider
        </button>
        <button className="new-page-button admin-button" onClick={handleNavigateToAdminRegister}>
          Register as Admin
        </button>
      </div>
    </div>
  );
};

export default NewPage;
