const express = require('express');
const router = express.Router();
const controller = require('../controllers/commentsController');
const { verifyToken, requireRole } = require('../middleware/auth');

// שליפת כל התגובות מכל הסופרים – ללקוחות
router.get('/', verifyToken, controller.getAllComments);

// שליפת תגובות למוצרים בסופר של המנהל בלבד – ללא מחיקה/הוספה
router.get('/manager', verifyToken, requireRole('manager'), controller.getManagerComments);

// יצירת תגובה חדשה על מוצר – לקוחות בלבד
router.post('/', verifyToken, requireRole('customer'), controller.createComment);

// מחיקת תגובה לפי ID – רק אם היא שייכת ללקוח עצמו
router.delete('/:id', verifyToken, requireRole('customer'), controller.deleteComment);

module.exports = router;
