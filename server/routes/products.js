const express = require('express');
const router = express.Router();
const { verifyToken, requireRole } = require('../middleware/auth');

// ראוט שמוגן – רק למנהלים
router.post('/add', verifyToken, requireRole('manager'), (req, res) => {
  // כאן תכתבי את הקוד להוספת מוצר
  res.json({ message: 'Product added!' });
});

module.exports = router;
