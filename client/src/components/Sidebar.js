// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ isOpen, onClose, handleLogout }) => {
  return (
    <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-overlay" onClick={onClose}></div>
      <div className="sidebar-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <nav className="sidebar-nav">
          <Link to="/analytics" className="sidebar-link" onClick={onClose}>
            Analytics
          </Link>
          <button className="sidebar-link logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;