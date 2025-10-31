const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // Corrected to bcryptjs which we installed
const User = require('../models/User'); // Import the User model
const jwt = require('jsonwebtoken');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        // 1. Get user data from the request body
        const { name, email, password } = req.body;

        // 2. Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 3. Create a new user instance
        user = new User({
            name,
            email,
            password,
        });

        // 4. Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // 5. Save the user to the database
        await user.save();

        // 6. Send a success response
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
// In server/routes/authRoutes.js
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

        const payload = { user: { id: user.id } };

        jwt.sign(
            payload,
            process.env.JWT_SECRET, // This will now have the correct value
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

// --- PASTE THIS ENTIRE BLOCK INTO YOUR FILE ---

const authMiddleware = require('../middleware/authMiddleware');

// @route   GET /api/auth/me
// @desc    Get logged in user's data (except password)
// @access  Private
router.get('/me', authMiddleware, async (req, res) => {
    try {
        // req.user.id is attached by the authMiddleware from the token
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/settings', authMiddleware, async (req, res) => {
  const { focus, shortBreak, longBreak } = req.body;

  // Basic validation to ensure we have numbers
  if (typeof focus !== 'number' || typeof shortBreak !== 'number' || typeof longBreak !== 'number') {
    return res.status(400).json({ msg: 'Invalid settings format.' });
  }

  try {
    // req.user is the full user document from our upgraded authMiddleware
    const user = req.user;

    user.settings = { focus, shortBreak, longBreak };

    await user.save();

    // Send back the updated user object (excluding password)
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid Credentials' });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });
        
        const payload = { user: { id: user.id } };
        
        const secret = process.env.JWT_SECRET;
        
        // --- THIS IS THE CRITICAL SAFETY CHECK ---
        // If the secret key is missing for any reason (like a cold start),
        // we must not create a token. Instead, we throw a server error.
        if (!secret) {
            console.error('FATAL ERROR: JWT_SECRET is not defined on the server.');
            return res.status(500).send('Server configuration error.');
        }
        // ---------------------------------------------
        
        console.log(`--- LOGIN ROUTE: Signing token with a valid secret. ---`);
        
        jwt.sign(
            payload,
            secret, // Use the validated secret
            { expiresIn: '5h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;