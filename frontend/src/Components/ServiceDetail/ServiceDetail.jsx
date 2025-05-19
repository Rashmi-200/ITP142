import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ServiceDetail.css';

const API_URL = 'http://localhost:4000';

const ServiceDetail = () => {
  const { serviceType } = useParams();
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProviders();
  }, [serviceType]);

  const fetchProviders = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/serviceProvider/auth/all`);
      if (response.data.success) {
        const filtered = response.data.serviceProviders.filter(
          (provider) =>
            provider.serviceType.toLowerCase() === serviceType.toLowerCase() &&
            provider.status === 'verified'
        );
        setProviders(filtered);

        const ratingsData = {};
        const reviewsData = {};

        for (const provider of filtered) {
          try {
            const reviewRes = await axios.get(`${API_URL}/api/reviews/provider/${provider.fullName}`);
            const providerReviews = reviewRes.data;

            if (providerReviews.length > 0) {
              const totalRating = providerReviews.reduce((sum, r) => sum + r.rating, 0);
              ratingsData[provider._id] = (totalRating / providerReviews.length).toFixed(1);
              reviewsData[provider._id] = providerReviews;
            } else {
              ratingsData[provider._id] = 'N/A';
              reviewsData[provider._id] = [];
            }
          } catch (reviewErr) {
            ratingsData[provider._id] = 'N/A';
            reviewsData[provider._id] = [];
          }
        }
        setRatings(ratingsData);
        setReviews(reviewsData);
      }
    } catch (err) {
      setError('Failed to load providers');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (provider) => {
    navigate('/booking-form', {
      state: {
        serviceType,
        providerName: provider.fullName,
        providerEmail: provider.email,
      },
    });
  };

  const handleReview = (provider) => {
    navigate('/review-form', {
      state: {
        providerName: provider.fullName,
        serviceType,
      },
    });
  };

  return (
    <div className="service-detail-page">
      <h2 className="title">{serviceType} Providers</h2>
      {loading ? (
        <p>Loading providers...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : providers.length === 0 ? (
        <p>No verified providers available for {serviceType} yet.</p>
      ) : (
        <div className="provider-grid">
          {providers.map((provider) => (
            <div className="provider-card" key={provider._id}>
              <h3>
                {provider.fullName}
                {ratings[provider._id] && ratings[provider._id] !== 'N/A' && (
                  <span> ⭐ {ratings[provider._id]} / 5</span>
                )}
              </h3>
              <p><strong>Experience:</strong> {provider.experience} years</p>
              <p><strong>Phone:</strong> {provider.phone}</p>
              <p><strong>Email:</strong> {provider.email}</p>

              <div className="reviews-section">
                <h4>Customer Reviews:</h4>
                {reviews[provider._id] && reviews[provider._id].length > 0 ? (
                  reviews[provider._id].map((rev) => (
                    <div key={rev._id} className="review-box">
                      <p><strong>{rev.name}</strong> ({rev.rating}⭐)</p>
                      <p>{rev.reviewText}</p>
                    </div>
                  ))
                ) : (
                  <p>No reviews yet.</p>
                )}
              </div>

              <button className="book-btn" onClick={() => handleBookNow(provider)}>
                Book Now
              </button>
              <button className="review-btn" onClick={() => handleReview(provider)}>
                Write a Review
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceDetail;
