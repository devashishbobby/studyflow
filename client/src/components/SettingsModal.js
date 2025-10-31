// src/components/SettingsModal.js
import React, { useState, useEffect } from 'react';
import './SettingsModal.css';

const SettingsModal = ({ isOpen, onClose, currentSettings, onSave }) => {
  // Internal state to manage the form while the user is editing
  const [settings, setSettings] = useState(currentSettings);

  // This effect ensures that if the modal is re-opened, it shows the latest settings
  useEffect(() => {
    setSettings(currentSettings);
  }, [currentSettings]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Ensure we are saving numbers, not strings
    setSettings(prev => ({ ...prev, [name]: parseInt(value, 10) }));
  };

  const handleSave = () => {
    onSave(settings);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Settings</h2>
        <div className="settings-form">
          <div className="form-group">
            <label htmlFor="focus">Focus (minutes)</label>
            <input type="number" id="focus" name="focus" value={settings.focus} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="shortBreak">Short Break (minutes)</label>
            <input type="number" id="shortBreak" name="shortBreak" value={settings.shortBreak} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="longBreak">Long Break (minutes)</label>
            <input type="number" id="longBreak" name="longBreak" value={settings.longBreak} onChange={handleChange} />
          </div>
        </div>
        <div className="modal-actions">
          <button className="modal-btn cancel-btn" onClick={onClose}>Cancel</button>
          <button className="modal-btn ok-btn" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;