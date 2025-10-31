// src/pages/Register.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api'; // Use the central API file
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import './AuthForm.css';
import AuthLayout from '../components/AuthLayout';

const Register = () => {
  // --- THESE LINES WERE MISSING OR INCORRECT ---
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  const { name, email, password } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  // -------------------------------------------

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use the 'api' instance and the correct endpoint
      await api.post('/auth/register', { name, email, password });
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <AuthLayout>
      <div className="auth-box">
        <Link to="/" className="back-to-home">← Back to Home</Link>
        <h2>Create Account</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" value={name} onChange={onChange} required className="form-input"/>
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={email} onChange={onChange} required className="form-input"/>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={password} onChange={onChange} required className="form-input"/>
            <PasswordStrengthMeter password={password} />
          </div>
          <button type="submit" className="auth-button">Register</button>
        </form>
      </div>
    </AuthLayout>
  );
};
export default Register;