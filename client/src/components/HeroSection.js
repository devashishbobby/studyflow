// src/components/HeroSection.js
import React from 'react';
import './HeroSection.css';
import { Link } from 'react-router-dom';
import backgroundImage from './study-image.jpg'; // <-- 1. IMPORT THE IMAGE

const HeroSection = () => {
  return (
    // 2. APPLY THE IMAGE USING AN INLINE STYLE
    <div 
      className='hero-container' 
      id="home" 
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <h1>Your Calm Space to Track Tasks</h1>
      <p>Bring clarity to your goals. Our minimalist dashboard helps you manage tasks and build momentum effortlessly.</p>
      <div className='hero-btns'>
        <Link to="/login" className='btn btn--outline'>
          Continue with Email
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;