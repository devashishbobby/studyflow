// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

// Import your custom function from firebase.js
import { checkRedirectResult } from './firebase'; 

// Import pages and components
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AnalyticsPage from './pages/AnalyticsPage';
import PrivateRoute from './components/PrivateRoute';

function AppContent() {
  const navigate = useNavigate();

  useEffect(() => {
    const processRedirect = async () => {
      try {
        const result = await checkRedirectResult();

        if (result && result.user) {
          console.log("✅ Google redirect result captured!", result.user);
          const firebaseUser = result.user;

          const userData = {
            name: firebaseUser.displayName,
            email: firebaseUser.email,
            uid: firebaseUser.uid,
            photoURL: firebaseUser.photoURL,
          };

          const res = await axios.post('/api/auth/google', userData);
          localStorage.setItem('token', res.data.token);
          
          console.log("🚀 Redirecting to dashboard...");
          navigate('/dashboard');
        }
      } catch (error) {
        console.error("Error processing Google redirect:", error);
      }
    };
    
    processRedirect();
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/analytics" element={<AnalyticsPage />} />
      <Route element={<PrivateRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <div className="App">
        <AppContent />
      </div>
    </Router>
  );
}

export default App;