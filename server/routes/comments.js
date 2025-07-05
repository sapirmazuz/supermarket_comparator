const express = require('express');
const router = express.Router();

// בדיקה ראשונית
router.get('/', (req, res) => {
  res.send('OK');
});

module.exports = router;
