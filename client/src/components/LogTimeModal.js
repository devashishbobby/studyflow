// src/components/LogTimeModal.js
import React, { useState } from 'react';
import './LogTimeModal.css';

const LogTimeModal = ({ isOpen, onClose, onLogTime, taskTitle }) => {
  const [minutes, setMinutes] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    const duration = parseInt(minutes, 10);
    if (!isNaN(duration) && duration > 0) {
      onLogTime(duration);
      setMinutes('');
      onClose();
    } else {
      alert('Please enter a valid number of minutes.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Log Time for: <span className="task-title-highlight">{taskTitle}</span></h2>
        <div className="log-time-form">
          <input
            type="number"
            className="modal-input"
            placeholder="Enter minutes worked"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            autoFocus
          />
          <span>minutes</span>
        </div>
        <div className="modal-actions">
          <button className="modal-btn cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-btn ok-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogTimeModal;