// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [activeLink, setActiveLink] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
        const homeSection = document.getElementById('home');
        const trackerSection = document.getElementById('tracker');
        const contactSection = document.getElementById('contact');

        const scrollPosition = window.scrollY + 150; // Increased offset for better accuracy

        // THIS IS THE NEW FIX: Check if we are at the bottom of the page
        if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 2) {
            setActiveLink('contact');
        } else if (contactSection && scrollPosition >= contactSection.offsetTop) {
            setActiveLink('contact');
        } else if (trackerSection && scrollPosition >= trackerSection.offsetTop) {
            setActiveLink('tracker');
        } else if (homeSection && scrollPosition >= homeSection.offsetTop) {
            setActiveLink('home');
        }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
}, []);

  // Inside Navbar.js
return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          StudyFlow {/* <-- Changed from ProTrack */}
        </Link>
        
        <div className="nav-right-side">
          <a href="/#home" className={activeLink === 'home' ? 'nav-links active' : 'nav-links'}>
            Home
          </a>
          <a href="/#tracker" className={activeLink === 'tracker' ? 'nav-links active' : 'nav-links'}>
            Tracker
          </a>
          <a href="/#contact" className={activeLink === 'contact' ? 'nav-links active' : 'nav-links'}>
            Contact
          </a>
        {/* The class here is now just "nav-links" */}
  <Link to="/login" className="nav-links">
    Login
  </Link>
  
  {/* The class here is also now just "nav-links" */}
  <Link to="/register" className="nav-links">
    Register
  </Link>
        </div>
      </div>
    </nav>
);
};

export default Navbar;