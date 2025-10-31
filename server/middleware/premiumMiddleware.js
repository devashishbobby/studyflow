// server/middleware/premiumMiddleware.js

const premiumMiddleware = (req, res, next) => {
  // We assume that the 'authMiddleware' has already run and attached the user object to the request.
  // The user object contains all the fields from our User model, including 'isPremium'.

  if (req.user && req.user.isPremium) {
    // If the user object exists and their isPremium flag is true, allow them to proceed.
    next();
  } else {
    // If the user is not premium, send a '403 Forbidden' error.
    // This is the correct HTTP status code for a user who is authenticated but not authorized to see this content.
    return res.status(403).json({ msg: 'Access denied. Premium subscription required.' });
  }
};

module.exports = premiumMiddleware;