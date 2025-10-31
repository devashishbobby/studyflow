// server/routes/paymentRoutes.js

const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto'); // Built-in Node.js module for verification
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User'); // We need the User model to update their status
require('dotenv').config();

// Initialize Razorpay client with your API keys
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =================================================================
//   ENDPOINT 1: CREATE A PAYMENT ORDER
// =================================================================
// @route   POST /api/payment/create-order
// @desc    Creates a Razorpay order for the frontend to use
// @access  Private (only a logged-in user can create an order)
router.post('/create-order', authMiddleware, async (req, res) => {
  try {
    // We'll hardcode the premium price for now.
    // Amount is in the smallest currency unit. 19900 paise = ₹199.00
    const options = {
      amount: 19900, 
      currency: 'INR',
      receipt: `receipt_order_${new Date().getTime()}`, // A unique receipt ID
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send('Error creating Razorpay order');
    }

    // Send the created order details back to the frontend
    res.json(order);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// =================================================================
//   ENDPOINT 2: VERIFY THE PAYMENT
// =================================================================
// @route   POST /api/payment/verify-payment
// @desc    Verifies the payment signature and upgrades user to premium
// @access  Private
router.post('/verify-payment', authMiddleware, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // This is the critical security step provided by Razorpay
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      // The signature is valid, so the payment is legitimate.

      // Now, find the logged-in user and update their status to premium
      const user = await User.findById(req.user.id);
      user.isPremium = true;
      await user.save();
      
      res.json({ success: true, message: 'Payment successful! You are now a premium user.' });

    } else {
      // The signature is invalid, this might be a fraudulent attempt
      res.status(400).json({ success: false, message: 'Payment verification failed.' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;