// src/pages/Login.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api'; // Use the central API file
import './AuthForm.css';
import AuthLayout from '../components/AuthLayout';

const Login = () => {
  // --- THESE LINES WERE MISSING OR INCORRECT ---
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { email, password } = formData;
  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  // -------------------------------------------

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use the 'api' instance and the correct endpoint
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert(err.response?.data?.message || 'An error occurred.');
    }
  };

  return (
    <AuthLayout>
      <div className="auth-box">
        <Link to="/" className="back-to-home">← Back to Home</Link>
        <h2>Login</h2>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={email} onChange={onChange} required className="form-input"/>
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" name="password" value={password} onChange={onChange} required className="form-input"/>
          </div>
          <button type="submit" className="auth-button">Login</button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;