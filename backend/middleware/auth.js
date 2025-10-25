/**
 * Authentication Middleware
 * Validates JWT tokens for protected routes
 */
const jwt = require('jsonwebtoken');
const sessionManager = require('../utils/sessionManager');

const auth = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided, authentication required' });
    }
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Validate session
    const isValid = sessionManager.validateSession(decoded.userId, token);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid or expired session' });
    }
    
    // Attach user info to request
    req.userId = decoded.userId;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token, please authenticate' });
  }
};

module.exports = auth;
