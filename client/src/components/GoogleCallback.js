// client/src/components/GoogleCallback.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkRedirectResult } from '../firebase';
import api from '../utils/api';

const GoogleCallback = () => {
  const [status, setStatus] = useState('Processing sign-in...');
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('🔍 GoogleCallback: Checking redirect result...');
        const result = await checkRedirectResult();
        
        console.log('📦 Redirect result:', result);
        
        if (result && result.user) {
          console.log('✅ User found:', result.user.email);
          setStatus('Completing sign-in...');
          
          const userData = {
            email: result.user.email,
            name: result.user.displayName,
            uid: result.user.uid,
            photoURL: result.user.photoURL,
          };
          
          console.log('📤 Sending to backend:', userData);
          
          const response = await api.post('/auth/google', userData);
          
          console.log('✅ Backend response:', response.data);
          
          localStorage.setItem('token', response.data.token);
          console.log('✅ Token saved');
          
          setStatus('Success! Redirecting...');
          setTimeout(() => navigate('/dashboard'), 500);
        } else {
          console.log('⚠️ No user in redirect result');
          setStatus('No sign-in detected. Redirecting...');
          setTimeout(() => navigate('/'), 2000);
        }
      } catch (err) {
        console.error('❌ Callback error:', err);
        console.error('Error details:', err.response?.data);
        setStatus(`Error: ${err.message || 'Sign-in failed'}`);
        setTimeout(() => navigate('/'), 3000);
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: '#1a1a1a',
      color: '#fff'
    }}>
      <h2 style={{ color: '#FF7A00', marginBottom: '20px' }}>🔐 Google Sign-In</h2>
      <p>{status}</p>
      <div style={{ marginTop: '20px' }}>
        <div className="spinner" style={{
          border: '4px solid rgba(255, 122, 0, 0.1)',
          borderTop: '4px solid #FF7A00',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    </div>
  );
};

export default GoogleCallback;