const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/authMiddleware');
const premiumMiddleware = require('../middleware/premiumMiddleware');
const Task = require('../models/Task');

// --- 1. UPGRADED ROUTE: This now summarizes TIME SPENT per day (for the Bar Chart) ---
// @route   GET /api/analytics/task-summary
// @desc    Get a summary of total focus hours per day
// @access  Private (Premium)
router.get(
  '/task-summary',
  [authMiddleware, premiumMiddleware],
  async (req, res) => {
    try {
      const timeSummary = await Task.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(req.user.id),
            timeSpent: { $gt: 0 }, // Only include tasks where time has been spent
          },
        },
        {
          $group: {
            // Group by the date the task was last updated
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' } },
            // Sum the 'timeSpent' field (in minutes) for each group
            totalMinutes: { $sum: '$timeSpent' },
          },
        },
        { $sort: { _id: 1 } }, // Sort by date
        {
          $project: {
            _id: 0,
            date: '$_id',
            // Convert the total minutes to hours for the frontend chart
            totalHours: { $divide: ['$totalMinutes', 60] },
          },
        },
      ]);
      res.json(timeSummary);
    } catch (err) {
      console.error('Time Summary Analytics Error:', err.message);
      res.status(500).send('Server Error');
    }
  }
);

// --- 2. NEW ROUTE: For the Pie Chart ---
// @route   GET /api/analytics/time-by-subject
// @desc    Get a summary of time spent per subject
// @access  Private (Premium)
router.get(
  '/time-by-subject',
  [authMiddleware, premiumMiddleware],
  async (req, res) => {
    try {
      const subjectSummary = await Task.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(req.user.id),
            timeSpent: { $gt: 0 },
          },
        },
        {
          $group: {
            _id: '$subject', // Group all tasks by their 'subject' field
            // Sum the 'timeSpent' for all tasks within each subject group
            totalMinutes: { $sum: '$timeSpent' },
          },
        },
        {
          $project: {
            _id: 0,
            subject: '$_id',
            totalMinutes: 1,
          },
        },
      ]);
      res.json(subjectSummary);
    } catch (err) {
      console.error('Subject Analytics Error:', err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;

