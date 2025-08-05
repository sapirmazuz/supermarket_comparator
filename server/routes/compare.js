// server/routes/compare.js

const express = require('express');
const router = express.Router();
const controller = require('../controllers/compareController');
const { verifyToken } = require('../middleware/auth');

// חישוב השוואה
router.post('/', verifyToken, controller.compareSupermarkets);

module.exports = router;
