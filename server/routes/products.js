const express = require('express');
const router = express.Router();
const controller = require('../controllers/productsController');
const { verifyToken, requireRole } = require('../middleware/auth');

// שליפת כל המוצרים בקטלוג – פתוח לכולם
router.get('/', controller.getAllProducts);

// יצירת מוצר חדש בקטלוג – רק ל־admin
router.post('/', verifyToken, requireRole('manager'), controller.createCatalogProduct);

// שיוך מוצר לסופר – רק ל־manager
router.post('/assign', verifyToken, requireRole('manager'), controller.addProductToSupermarket);

// שליפת מוצרים לפי סופרמרקט – גם לקוח וגם מנהל יכולים (רק צריך להיות מחובר)
router.get('/supermarket', verifyToken, controller.getAvailableProductsForSupermarket);

module.exports = router;
