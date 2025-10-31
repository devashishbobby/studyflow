const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  console.log('--- 1. Auth Middleware Triggered ---');
  
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    console.error('--- 2. Middleware Failed: No token found. ---');
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // --- THIS IS THE MOST IMPORTANT LOG ---
  const secret = process.env.JWT_SECRET;
  console.log(`--- 2. JWT_SECRET from environment is: "${secret}" ---`);
  // ------------------------------------

  if (!secret) {
    console.error('--- 3. Middleware Failed: JWT_SECRET is missing or undefined! ---');
    return res.status(500).json({ msg: 'Server configuration error.' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    console.log('--- 3. Token successfully verified. ---');
    
    const freshUser = await User.findById(decoded.user.id).select('-password');
    if (!freshUser) {
        console.error('--- 4. Middleware Failed: User in token not found in DB. ---');
        return res.status(401).json({ msg: 'User not found, authorization denied' });
    }

    req.user = freshUser;
    console.log('--- 4. Attached fresh user to request. Proceeding. ---');
    next();
  } catch (err) {
    console.error('--- 3. Middleware Failed: Token verification error! ---', err.message);
    res.status(401).json({ msg: 'Token is not valid' });
  }
};



module.exports = authMiddleware;
