import React, { useState } from 'react';
import './AddTaskModal.css';

const AddTaskModal = ({ isOpen, onClose, onAddTask }) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(''); // <-- NEW: State to hold the subject

  if (!isOpen) {
    return null;
  }

  const handleSubmit = () => {
    if (title.trim()) {
      onAddTask(title, subject); // <-- Pass BOTH title and subject back
      setTitle('');
      setSubject(''); // <-- Reset the subject field after submission
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Add a new task</h2>
        <input
          type="text"
          className="modal-input"
          placeholder="Task title (e.g., Read Chapter 5)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
        {/* --- NEW: Input field for the subject --- */}
        <input
          type="text"
          className="modal-input"
          placeholder="Subject (e.g., Physics, Project X)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <div className="modal-actions">
          <button className="modal-btn cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-btn ok-btn" onClick={handleSubmit}>
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;

