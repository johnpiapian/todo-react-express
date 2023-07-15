const express = require('express');
const authController = require('../Controllers/authController');
const router = express.Router();

// POST request to /auth/login
router.post('/login', authController.login);

// POST request to /auth/signup
router.post('/signup', authController.signup);

module.exports = router;