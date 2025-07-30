// התחברות, הרשמה, אימות, שליפת משתמשים לפי תפקיד.

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/usersController');

// רישום משתמש
router.post('/register', register);

// התחברות משתמש
router.post('/login', login);

module.exports = router;
