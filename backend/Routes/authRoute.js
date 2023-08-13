const express = require('express');
const router = express.Router();
const jwtUtil = require('../Utils/Jwt');
const authService = require('../Services/authService');

// POST request to /auth/login
router.post('/login', (req, res) => {
    // get the user details from the request body
    let { email, password } = req.body;

    // input validation
    if (!(!!email && !!password))
        return res.status(401).json({ error: "Invalid input" });

    // input sanitization
    email = email.trim();
    password = password.trim();

    authService.authenticate(email, password)
        .then((token) => {
            return res.status(200).json({ token });
        })
        .catch((err) => {
            return res.status(401).json({ error: "Authentication failed!" });
        });
});

// POST request to /auth/signup
router.post('/signup', (req, res) => {
    let { name, email, password } = req.body;

    // input validation
    if (!(!!name && !!email && !!password))
        return res.status(401).json({ error: "Invalid input" });

    // input sanitization
    name = name.trim();
    email = email.trim();
    password = password.trim();

    authService.signup(name, email, password)
        .then((userId) => {
            return res.status(200).json({ userId });
        })
        .catch((err) => {
            return res.status(401).json({ error: "Registration failed!" });
        });
});

// POST: /auth/forgotPassword
router.post('/forgotPassword', (req, res) => {
    const { email } = req.body;

    if (!email) return res.status(401).json({ error: "Missing a required field" });

    authService.forgotPassword(email)
        .then((token) => {
            // TODO: Send email with link to reset password
            const link = `http://localhost:3000/auth/resetPassword?token=${token}`;
            return res.status(200).json({ link });
        })
        .catch((err) => {
            return res.status(401).json({ error: "An error occured resetting password" });
        });
});

// PUT: /auth/forgotPassword
router.put('/resetPassword', (req, res) => {
    const { password } = req.body;
    const decodedToken = jwtUtil.verifyToken(req.query.token, 'reset');

    if (!password || !decodedToken) return res.status(401).json({ error: "An error occured resetting password" });

    authService.resetPassword(decodedToken.email, password)
        .then((user) => {
            return res.status(200).json({ message: "Password reset successful!" });
        })
        .catch((err) => {
            return res.status(401).json({ error: "Password resetting failed!" });
        });
});

module.exports = router;