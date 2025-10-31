const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const Task = require('../models/Task');

// --- MODIFIED: Create a new task now includes a 'subject' ---
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, subject } = req.body; // Changed to accept subject

    const newTask = new Task({
      title,
      subject: subject || 'General', // Use provided subject or default to 'General'
      user: req.user.id,
    });

    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- NEW: Endpoint to log time for a specific task ---
router.put('/:id/log-time', authMiddleware, async (req, res) => {
  try {
    const { duration } = req.body; // Expecting duration in minutes from the frontend

    const task = await Task.findById(req.params.id);

    // Security check: ensure the task exists and belongs to the logged-in user
    if (!task || task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Task not found or user not authorized' });
    }

    // Increment the timeSpent field and save the task
    task.timeSpent += duration;
    await task.save();

    res.json(task);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- Your existing GET, PUT (for toggle), and DELETE routes remain below ---

// GET /api/tasks
router.get('/', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT /api/tasks/:id (for toggling completion)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        if (!task || task.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Task not found or user not authorized' });
        }
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE /api/tasks/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || task.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Task not found or user not authorized' });
    }
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

