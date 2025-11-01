// server/index.js

// 1. Import dependencies
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');


// 2. Conditional dotenv configuration for local development
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// 3. Initialize Express App
const app = express();
app.use(cors({
  origin: process.env.CORS_ORIGIN, // We will set this variable on Render
  credentials: true
}));

// 4. Connect to Database
connectDB();

// 5. Configure Middleware

// --- START: CORRECT CORS CONFIGURATION ---
const allowedOrigins = [
  'http://localhost:3000',
  'https://final-returns-sbl-project.vercel.app'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('This origin is not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD'], // Explicitly allow methods
  allowedHeaders: ['Content-Type', 'Authorization'],      // Explicitly allow headers
};

app.use(cors(corsOptions));
// --- END: ENHANCED CORS CONFIGURATION ---

app.use(express.json());

// 6. Define API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));

// 7. Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));