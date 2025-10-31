// src/components/AuthLayout.js
import React from 'react';
import './AuthLayout.css';
import backgroundImage from './study-image.jpg'; // <-- 1. IMPORT THE IMAGE

const AuthLayout = ({ children }) => {
  return (
    // 2. APPLY THE IMAGE USING AN INLINE STYLE
    <div 
      className="auth-layout-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {children} {/* This is where the Login or Register form will appear */}
    </div>
  );
};

export default AuthLayout;