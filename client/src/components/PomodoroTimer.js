import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import './PomodoroTimer.css';

const PomodoroTimer = ({ settings, tasks, onSessionComplete }) => {
  const [mode, setMode] = useState('focus');
  const [isActive, setIsActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(settings.focus * 60);
  const [sessionCount, setSessionCount] = useState(0);
  const [activeTaskId, setActiveTaskId] = useState(null);

  const uncompletedTasks = tasks.filter(task => !task.isCompleted);

  // --- UPGRADED: Countdown logic with sound notification ---
  useEffect(() => {
    let interval = null;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(t => t - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isActive) {
      setIsActive(false);
      
      // --- NEW: Play the sound notification ---
      // This creates a new Audio object and plays it.
      // The path '/sounds/alarm.mp3' points to your file in the 'public' folder.
      const alarmSound = new Audio('/sounds/alarm.mp3');
      alarmSound.play();
      
      if (mode === 'focus' && activeTaskId) {
        api.put(`/tasks/${activeTaskId}/log-time`, { duration: settings.focus })
           .then(() => onSessionComplete())
           .catch(err => console.error("Failed to log time", err));
      }

      const newSessionCount = mode === 'focus' ? sessionCount + 1 : sessionCount;
      setSessionCount(newSessionCount);

      if (mode === 'focus') {
        if ((newSessionCount) % 4 === 0) selectMode('longBreak');
        else selectMode('shortBreak');
      } else {
        selectMode('focus');
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);
  
  useEffect(() => {
    if (!isActive) {
      const newTime = (mode === 'focus' ? settings.focus : mode === 'shortBreak' ? settings.shortBreak : settings.longBreak) * 60;
      setTimeRemaining(newTime);
    }
  }, [mode, settings]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleTimer = () => {
    if (mode === 'focus' && !activeTaskId && !isActive && uncompletedTasks.length > 0) {
      alert('Please select a task to focus on before starting the timer.');
      return;
    }
    setIsActive(!isActive);
  };
  
  const selectMode = (newMode) => {
    setIsActive(false);
    setMode(newMode);
  };

  return (
    <div className="widget-card pomodoro-timer">
      {mode === 'focus' && (
        <div className="task-selector">
          <select 
            value={activeTaskId || ''} 
            onChange={(e) => setActiveTaskId(e.target.value)}
            disabled={isActive}
          >
            <option value="" disabled>Select a task to focus on...</option>
            {uncompletedTasks.map(task => (
              <option key={task._id} value={task._id}>{task.title} ({task.subject})</option>
            ))}
          </select>
        </div>
      )}
      <div className="timer-modes">
        <button className={`mode-btn ${mode === 'focus' ? 'active' : ''}`} onClick={() => selectMode('focus')}>Focus</button>
        <button className={`mode-btn ${mode === 'shortBreak' ? 'active' : ''}`} onClick={() => selectMode('shortBreak')}>Short Break</button>
        <button className={`mode-btn ${mode === 'longBreak' ? 'active' : ''}`} onClick={() => selectMode('longBreak')}>Long Break</button>
      </div>
      <div className="timer-display">{formatTime(timeRemaining)}</div>
      <div className="timer-controls">
        <button className="control-btn start-btn" onClick={toggleTimer}>{isActive ? 'Pause' : 'Start'}</button>
      </div>
    </div>
  );
};

export default PomodoroTimer;

