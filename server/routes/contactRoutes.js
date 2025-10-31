// server/routes/contactRoutes.js

const express = require('express');
const router = express.Router();
const Message = require('../models/Message'); // Import our new model

// @route   POST /api/contact
// @desc    Save a contact form message
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newMessage = new Message({
      name,
      email,
      message,
    });

    await newMessage.save();

    res.json({ msg: 'Message received! Thank you.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;