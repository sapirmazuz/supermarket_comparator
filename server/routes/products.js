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

router.get('/my', verifyToken, requireRole('manager'), controller.getMyProducts);
router.put('/my/:product_id', verifyToken, requireRole('manager'), controller.updateAssignedProduct);
router.delete('/my/:product_id', verifyToken, requireRole('manager'), controller.deleteAssignedProduct);

module.exports = router;
