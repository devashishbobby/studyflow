// src/pages/LandingPage.js
import React from 'react';
import './LandingPage.css';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection'; // <-- Import
import ContactSection from '../components/ContactSection'; // <-- Import
import Footer from '../components/Footer';                 // <-- Import

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturesSection /> {/* <-- Add */}
      <ContactSection />  {/* <-- Add */}
      <Footer />          {/* <-- Add */}
    </>
  );
};

export default LandingPage;