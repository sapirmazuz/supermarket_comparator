const express = require('express');
const router = express.Router();
const supermarketsController = require('../controllers/supermarketsController');

router.get('/', supermarketsController.getAllSupermarkets);
router.post('/add', supermarketsController.addSupermarket);

module.exports = router;
