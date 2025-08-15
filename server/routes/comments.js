const express = require('express');
const router = express.Router();
const controller = require('../controllers/commentsController');
const { verifyToken, requireRole } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// uploads בשורש הפרויקט: project/uploads
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true }); // יוודא שהתיקייה קיימת

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, unique);
  },
});
const upload = multer({ storage });

// שליפת תגובות
router.get('/', verifyToken, controller.getAllComments);

// למנהלים
router.get('/manager', verifyToken, requireRole('manager'), controller.getAllComments);

// הוספת תגובה + תמונה (עם טיפול שגיאת Multer לקריאה ברורה במקום 500)
router.post(
  '/',
  verifyToken,
  requireRole('client'),
  (req, res, next) => {
    upload.single('image_url')(req, res, (err) => {
      if (err) {
        console.error('❌ Multer error:', err);
        return res.status(400).json({ error: 'העלאת קובץ נכשלה', detail: err.message });
      }
      next();
    });
  },
  controller.createComment
);

// מחיקה
router.delete('/:id', verifyToken, requireRole('client'), controller.deleteComment);

module.exports = router;
