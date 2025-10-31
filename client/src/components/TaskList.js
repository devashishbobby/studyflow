import React, { useState } from 'react';
import './TaskList.css';

const TaskList = ({ tasks, onOpenModal, onDeleteTask, onToggleTask, onUpdateTask, onOpenLogTimeModal }) => {
  // --- NEW: State to manage which task is being edited ---
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedSubject, setEditedSubject] = useState('');

  const handleEditClick = (task) => {
    setEditingTaskId(task._id);
    setEditedTitle(task.title);
    setEditedSubject(task.subject);
  };

  const handleSave = (taskId) => {
    // Call the update function passed from the Dashboard
    onUpdateTask(taskId, { title: editedTitle, subject: editedSubject });
    // Exit edit mode
    setEditingTaskId(null);
  };

  const handleCancel = () => {
    setEditingTaskId(null);
  };

  return (
    <div className="widget-card">
      <div className="task-list-header">
        <h2>Tasks</h2>
        <button className="add-task-btn" onClick={onOpenModal}>+</button>
      </div>
      <div className="tasks-container">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <div key={task._id} className="task-item">
              {editingTaskId === task._id ? (
                // --- NEW: This is the EDITING VIEW ---
                <div className="task-edit-form">
                  <input
                    type="text"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="edit-input"
                  />
                  <input
                    type="text"
                    value={editedSubject}
                    onChange={(e) => setEditedSubject(e.target.value)}
                    className="edit-input subject"
                  />
                  <button onClick={() => handleSave(task._id)} className="edit-action-btn save">✓</button>
                  <button onClick={handleCancel} className="edit-action-btn cancel">×</button>
                </div>
              ) : (
                // --- This is the NORMAL VIEW ---
                <>
                  <div className="task-item-left">
                    <div 
                      className={`task-checkbox ${task.isCompleted ? 'completed' : ''}`}
                      onClick={() => onToggleTask(task._id, task.isCompleted)}
                    ></div>
                    <div className="task-details">
                      <span className={task.isCompleted ? 'completed-text' : ''}>
                        {task.title}
                      </span>
                      <span className="task-subject">{task.subject}</span>
                    </div>
                  </div>
                  <div className="task-item-right">
                    <button className="log-time-btn" title="Log Time Manually" onClick={() => onOpenLogTimeModal(task)}>⏱️</button>
                    {/* --- NEW: Edit button --- */}
                    <button className="edit-task-btn" title="Edit Task" onClick={() => handleEditClick(task)}>✏️</button>
                    <button 
                      className="delete-task-btn" 
                      onClick={() => onDeleteTask(task._id)}
                      title="Delete Task"
                    >
                      🗑️
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <p className="no-tasks-message">No tasks yet. Add one!</p>
        )}
      </div>
    </div>
  );
};

export default TaskList;

