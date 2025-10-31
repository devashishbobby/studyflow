import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import './Dashboard.css';
import TaskList from '../components/TaskList';
import AddTaskModal from '../components/AddTaskModal';
import PomodoroTimer from '../components/PomodoroTimer';
import SettingsModal from '../components/SettingsModal';
import Sidebar from '../components/Sidebar';
import LogTimeModal from '../components/LogTimeModal';

const getGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) { return { text: 'Good Morning', emoji: '☀️' }; } 
  else if (currentHour < 18) { return { text: 'Good Afternoon', emoji: '🌤️' }; } 
  else { return { text: 'Good Evening', emoji: '🌙' }; }
};

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogTimeModalOpen, setIsLogTimeModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const navigate = useNavigate();
  const greeting = getGreeting();

  const [timerSettings, setTimerSettings] = useState({
    focus: 25, shortBreak: 5, longBreak: 15,
  });

  const fetchData = async () => {
    try {
      if (!user) {
        const userRes = await api.get('/auth/me');
        setUser(userRes.data);
        if (userRes.data.settings) { setTimerSettings(userRes.data.settings); }
      }
      const tasksRes = await api.get('/tasks');
      setTasks(tasksRes.data);
      setLoading(false);
    } catch (err) { handleLogout(); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleAddTask = async (title, subject) => {
    try {
      await api.post('/tasks', { title, subject });
      fetchData();
    } catch (err) { console.error('Failed to add task', err); }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (err) { console.error('Failed to delete task', err); }
  };

  const handleToggleTask = async (taskId, currentStatus) => {
    try {
      const res = await api.put(`/tasks/${taskId}`, { isCompleted: !currentStatus });
      setTasks(tasks.map(task => (task._id === taskId ? res.data : task)));
    } catch (err) { console.error('Failed to update task', err); }
  };

  const handleSaveSettings = async (newSettings) => {
    try {
      const res = await api.put('/auth/settings', newSettings);
      setTimerSettings(res.data.settings);
      setIsSettingsModalOpen(false);
    } catch (err) { console.error('Failed to save settings', err); }
  };
  
  const handleOpenLogTimeModal = (task) => {
    setSelectedTask(task);
    setIsLogTimeModalOpen(true);
  };

  const handleLogTime = async (duration) => {
    if (!selectedTask) return;
    try {
      await api.put(`/tasks/${selectedTask._id}/log-time`, { duration });
      fetchData();
    } catch (err) { console.error('Failed to log time', err); }
  };

  // --- NEW: Function to handle editing a task ---
  const handleUpdateTask = async (taskId, updates) => {
    try {
      // Call the general purpose PUT endpoint with the new title and subject
      const res = await api.put(`/tasks/${taskId}`, updates);
      // Update the task list with the new data from the server
      setTasks(tasks.map(task => (task._id === taskId ? res.data : task)));
    } catch (err) {
      console.error('Failed to update task', err);
      alert('Could not update task. Please try again.');
    }
  };

  if (loading) { return <div className="dashboard-container">Loading...</div>; }

  return (
    <div className="dashboard-container">
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        handleLogout={handleLogout}
      />
      <div className="dashboard-content">
        <header className="dashboard-header">
          <div className="header-actions">
            <button title="Menu" onClick={() => setIsSidebarOpen(true)}>☰</button>
          </div>
          <div className="header-greeting">
            <h1>{greeting.text} {greeting.emoji}</h1>
            <p>{user.name}</p>
          </div>
          <div className="header-actions">
            <button title="Settings" onClick={() => setIsSettingsModalOpen(true)}>⚙️</button>
          </div>
        </header>

        <main>
          <PomodoroTimer 
            settings={timerSettings} 
            tasks={tasks}
            onSessionComplete={fetchData}
          />
          <TaskList
            tasks={tasks}
            onOpenModal={() => setIsTaskModalOpen(true)}
            onDeleteTask={handleDeleteTask}
            onToggleTask={handleToggleTask}
            onOpenLogTimeModal={handleOpenLogTimeModal}
            onUpdateTask={handleUpdateTask} // <-- Pass the new function down
          />
        </main>
      </div>
      
      <AddTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onAddTask={handleAddTask}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        currentSettings={timerSettings}
        onSave={handleSaveSettings}
      />
      <LogTimeModal
        isOpen={isLogTimeModalOpen}
        onClose={() => setIsLogTimeModalOpen(false)}
        onLogTime={handleLogTime}
        taskTitle={selectedTask?.title}
      />
    </div>
  );
};

export default Dashboard;

