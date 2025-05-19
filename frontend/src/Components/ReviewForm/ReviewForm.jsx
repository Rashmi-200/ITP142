import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ReviewForm.css";

const ReviewForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { providerName, serviceType } = location.state || {};

  const storedEmail = localStorage.getItem("userEmail") || "";

  const [formData, setFormData] = useState({
    name: "",
    email: storedEmail,
    rating: 0,
    reviewText: "",
    serviceProvider: providerName || "",
    category: serviceType || "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      await axios.post("http://localhost:4000/api/reviews/create", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage("Review submitted successfully!");
      setFormData({
        name: "",
        email: storedEmail,
        rating: 0,
        reviewText: "",
        serviceProvider: providerName || "",
        category: serviceType || "",
      });

      navigate(`/service-details/${serviceType}`);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  useEffect(() => {
    if (!providerName || !serviceType) {
      navigate("/booking-history");
    }
  }, [providerName, serviceType, navigate]);

  return (
    <div className="review-form-container">
      <h2>Submit a Review for {providerName}</h2>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email"
          required
          readOnly
        />

        <div className="rating-container">
          <p>Rating:</p>
          {[1, 2, 3, 4, 5].map((num) => (
            <span
              key={num}
              className={`star ${formData.rating >= num ? "filled" : ""}`}
              onClick={() => handleRatingClick(num)}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          name="reviewText"
          value={formData.reviewText}
          onChange={handleChange}
          placeholder="Your Review"
          required
        />

        <div className="category-selection">
          <p>Service Category:</p>
          <p className="selected-category">{formData.category}</p>
        </div>

        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default ReviewForm;
