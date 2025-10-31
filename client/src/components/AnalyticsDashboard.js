import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Bar, Pie } from 'react-chartjs-2'; // Import Pie chart
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import './AnalyticsDashboard.css';

// Register all necessary components for both charts
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AnalyticsDashboard = () => {
  const [barChartData, setBarChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // A key to force re-fetching data

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        // Fetch both sets of data concurrently
        const [timeSummaryRes, subjectSummaryRes] = await Promise.all([
          api.get('/analytics/task-summary'),
          api.get('/analytics/time-by-subject')
        ]);
        
        // --- Process data for Bar Chart (Time per Day) ---
        const barLabels = timeSummaryRes.data.map(item => item.date);
        const barDataPoints = timeSummaryRes.data.map(item => item.totalHours.toFixed(2));

        setBarChartData({
          labels: barLabels,
          datasets: [{
            label: 'Focus Hours per Day',
            data: barDataPoints,
            backgroundColor: '#FF7A00',
          }],
        });

        // --- Process data for Pie Chart (Time per Subject) ---
        const pieLabels = subjectSummaryRes.data.map(item => item.subject);
        const pieDataPoints = subjectSummaryRes.data.map(item => item.totalMinutes);
        
        setPieChartData({
          labels: pieLabels,
          datasets: [{
            label: 'Time Spent (minutes)',
            data: pieDataPoints,
            backgroundColor: ['#FF7A00', '#FFA500', '#FFD700', '#FF8C00', '#FF6347', '#FF4500'], // More colors
            borderColor: '#1F1F1F',
            borderWidth: 2,
          }],
        });

        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch analytics data', err);
        setError('Could not load analytics data.');
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [refreshKey]); // This effect will re-run whenever refreshKey changes

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { color: '#E0E0E0' } },
      title: { display: true, text: 'Your Productivity Over Time', color: '#FFFFFF', font: { size: 18 } },
    },
    scales: {
      y: { title: { display: true, text: 'Hours', color: '#aaa' }, beginAtZero: true, ticks: { color: '#aaa' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
      x: { type: 'category', ticks: { color: '#aaa' }, grid: { color: 'rgba(255, 255, 255, 0.1)' } },
    }
  };
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { color: '#E0E0E0' } },
      title: { display: true, text: 'Time Distribution by Subject', color: '#FFFFFF', font: { size: 18 } },
    },
  };

  if (loading) return <p style={{ color: '#fff', padding: '2rem' }}>Loading analytics...</p>;
  if (error) return <p style={{ color: 'red', padding: '2rem' }}>{error}</p>;

  return (
    <div className="analytics-container">
      <button onClick={() => setRefreshKey(prev => prev + 1)} className="refresh-btn">Refresh Data</button>
      {/* --- BAR CHART --- */}
      <div className="widget-card">
        <h2>Focus Hours Per Day</h2>
        <div className="chart-wrapper">
          {barChartData && barChartData.labels.length > 0 ? (
            <Bar options={barOptions} data={barChartData} />
          ) : (
            <p className="no-data-message">No time logged yet. Complete a focus session to see your progress!</p>
          )}
        </div>
      </div>
      
      {/* --- PIE CHART --- */}
      <div className="widget-card">
        <h2>Time by Subject</h2>
        <div className="chart-wrapper pie-chart-wrapper">
          {pieChartData && pieChartData.labels.length > 0 ? (
            <Pie options={pieOptions} data={pieChartData} />
          ) : (
            <p className="no-data-message">Log time on tasks with different subjects to see your time distribution.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;