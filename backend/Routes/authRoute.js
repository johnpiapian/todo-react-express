const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// POST request to /auth/login to log in a user
router.post('/login', authController.login);

// POST request to /auth/signup to sign up a user
router.post('/signup', authController.signup);

module.exports = router;