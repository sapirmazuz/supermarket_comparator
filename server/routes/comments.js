const express = require('express');
const router = express.Router();
const controller = require('../controllers/commentsController');
const { verifyToken, requireRole } = require('../middleware/auth');

// שליפת כל התגובות מכל הסופרים – ללקוחות
router.get('/', verifyToken, requireRole('customer'), controller.getAllComments);

// שליפת תגובות למוצרים בסופר של המנהל בלבד
router.get('/manager', verifyToken, requireRole('manager'), controller.getManagerComments);

// יצירת תגובה חדשה על מוצר – לקוחות בלבד
router.post('/', verifyToken, requireRole('customer'), controller.createComment);

module.exports = router;
