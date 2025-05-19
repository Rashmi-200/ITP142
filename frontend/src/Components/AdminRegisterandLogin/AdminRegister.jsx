// AdminRegister.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import AdminNavbar from '../AdminNavbar/AdminNavbar'; // ✅ Import AdminNavbar
import './AdminForm.css';

const AdminRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/admin/auth/register', { email, password });
      alert('Admin registered successfully');
      navigate('/admin/login');
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div>
      <div className="admin-form-container">
        <h2>Admin Register</h2>
        <form className="admin-form" onSubmit={handleRegister}>
          <label>Email</label>
          <input 
            type="email" 
            placeholder="Enter email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />

          <label>Password</label>
          <input 
            type="password" 
            placeholder="Enter password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />

          <button type="submit">Register</button>

          <p className="admin-form-footer">
            Already registered? <Link to="/admin/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
