// נתיבים: POST תגובה, GET תגובות לסופר.

const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/commentsController');

router.get('/', commentsController.getAllComments);
router.post('/add', commentsController.addComment);

module.exports = router;
