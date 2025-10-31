// client/src/utils/api.js -- DEBUGGING VERSION
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://protrack-api.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// This is the magic part: an "interceptor" that runs before every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log(`--- Interceptor: Attaching token? ---`, { tokenExists: !!token }); // Log if token exists

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    console.log('--- Outgoing Request Headers ---', config.headers); // Log the final headers
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;