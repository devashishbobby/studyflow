// client/src/components/PremiumUpgradePrompt.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './PremiumUpgradePrompt.css';

const loadRazorpayScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => { resolve(true); };
    script.onerror = () => { resolve(false); };
    document.body.appendChild(script);
  });
};

const PremiumUpgradePrompt = () => {
  const navigate = useNavigate();

  const handlePayment = async () => {
    // 1. Load the Razorpay checkout script
    const scriptLoaded = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!scriptLoaded) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    try {
      // 2. Call our backend to create a payment order
      const orderRes = await api.post('/payment/create-order');
      const order = orderRes.data;

      // 3. Configure the Razorpay options object
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Your public Key ID from .env
        amount: order.amount,
        currency: order.currency,
        name: 'ProTrack Premium',
        description: 'Lifetime access to analytics and premium features',
        order_id: order.id,

        // 4. The 'handler' function is the most important part.
        // It runs automatically after a successful payment.
        handler: async function (response) {
          const data = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          };
          
          // 5. Send the payment details to our backend to verify the signature
          const verificationRes = await api.post('/payment/verify-payment', data);
          
          alert(verificationRes.data.message); // Show success message
          if(verificationRes.data.success) {
            navigate('/dashboard'); // Redirect to dashboard after successful upgrade
          }
        },
        prefill: {
            name: "Devashish Bobby", // We can fetch the real user name here later
            email: "devashish@example.com",
            contact: "9999999999"
        },
        theme: {
            color: "#FF7A00" // Match your app's theme color
        }
      };

      // 6. Create a new Razorpay instance and open the checkout modal
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      console.error('Payment process failed', err);
      alert('An error occurred during the payment process. Please try again.');
    }
  };

  return (
    <div className="analytics-page-container">
      <div className="premium-card">
        <h1 className="premium-title">Unlock Your Full Potential</h1>
        <p className="premium-subtitle">
          Gain deeper insights into your productivity with ProTrack Premium.
        </p>
        <ul className="premium-features">
          <li>📊 Visual data graphs of your task completion rates.</li>
          <li>📈 Track your focus sessions and break patterns over time.</li>
          <li>💡 Identify your most productive days and times.</li>
        </ul>
        <button className="upgrade-btn" onClick={handlePayment}>Upgrade to Premium (₹199)</button>
        <Link to="/dashboard" className="back-link">
          ← Go back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default PremiumUpgradePrompt;