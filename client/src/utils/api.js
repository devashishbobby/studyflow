// client/src/utils/api.js
import axios from 'axios';

// This is the line we are fixing.
// It will now use your Vercel environment variable.
const baseURL = process.env.REACT_APP_API_URL 
                ? `${process.env.REACT_APP_API_URL}/api` // For production (Vercel)
                : 'http://localhost:5000/api';          // For local development

const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// This interceptor is correct and will attach your login token.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;