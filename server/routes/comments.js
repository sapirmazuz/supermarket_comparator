const express = require('express');
const router = express.Router();
const controller = require('../controllers/commentsController');
const { verifyToken, requireRole } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// הגדרת אחסון הקובץ
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // ודא שתיקייה זו קיימת
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// שליפת כל התגובות מכל הסופרים – ללקוחות
router.get('/', verifyToken, controller.getAllComments);

// שליפת תגובות למוצרים בסופר של המנהל בלבד – ללא מחיקה/הוספה
router.get('/manager', verifyToken, requireRole('manager'), controller.getAllComments);

// ✅ הוספת תגובה עם תמונה – מוסיפים את multer
router.post('/', verifyToken, requireRole('client'), upload.single('image_url'), controller.createComment);

// מחיקת תגובה לפי ID – רק אם היא שייכת ללקוח עצמו
router.delete('/:id', verifyToken, requireRole('client'), controller.deleteComment);

module.exports = router;
