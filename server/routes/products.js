const express = require('express');
const router = express.Router();
const controller = require('../controllers/productsController');
const auth = require('../middleware/auth');

router.get('/', controller.getAllProducts); // שליפת כל המוצרים בקטלוג
router.post('/', auth, controller.createCatalogProduct); // יצירת מוצר חדש בקטלוג (admin בלבד)
router.get('/supermarket', auth, controller.getProductsBySupermarket); // מוצרים לפי סופרמרקט

module.exports = router;
