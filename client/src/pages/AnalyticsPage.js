// client/src/pages/AnalyticsPage.js

import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import PremiumUpgradePrompt from '../components/PremiumUpgradePrompt';
import './AnalyticsPage.css'; // Import the stylesheet

const AnalyticsPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch user data', err);
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    // Now uses a class for consistent styling
    return (
      <div className="analytics-page-container loading">
        Loading...
      </div>
    );
  }

  // Wraps the content in the main container for the blue background
  return (
    <div className="analytics-page-container">
      {user && user.isPremium ? (
        <AnalyticsDashboard />
      ) : (
        <PremiumUpgradePrompt />
      )}
    </div>
  );
};

export default AnalyticsPage;