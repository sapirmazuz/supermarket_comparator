const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');
const { verifyToken, requireRole } = require('../middleware/auth');

// הוספת מוצר (למנהלים בלבד)
router.post('/add', verifyToken, requireRole('manager'), productsController.addProduct);

// שליפת כל המוצרים (פתוח לכולם)
router.get('/', productsController.getAllProducts);

module.exports = router;
