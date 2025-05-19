import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NewPage.css';

const NewPage = () => {
  const navigate = useNavigate();

  const handleNavigateToCustomerSignUp = () => {
    navigate('/login?type=customer');
  };

  const handleNavigateToProviderSignUp = () => {
    navigate('/login?type=provider');
  };

  return (
    <div className="new-page-container">
      <h2 className="new-page-title">Choose Your Sign Up Option</h2>
      <p className="new-page-subtitle">
        Whether you're looking for services or offering your skills, join us today!
      </p>

      <div className="new-page-buttons">
        <button className="new-page-button" onClick={handleNavigateToCustomerSignUp}>
          Sign Up as Customer
        </button>
        <button className="new-page-button" onClick={handleNavigateToProviderSignUp}>
          Sign Up as Service Provider
        </button>
      </div>
    </div>
  );
};

export default NewPage;
