// בודק JWT ומחלץ פרטי המשתמש לבקשות מוגנות.

const jwt = require('jsonwebtoken');
require('dotenv').config();

// מאמת שיש token חוקי
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid token' });
  }
}

// מאמת שהתפקיד תואם (למשל רק 'manager')
function requireRole(role) {
  return (req, res, next) => {
    
  console.log('🔍 checking role:', req.user?.role);
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
}

module.exports = { verifyToken, requireRole };
