const userService = require('../Services/authService');

// POST::/auth/login
function login(req, res) {
    // get the user details from the request body
    let { email, password } = req.body;

    // input validation
    if (!(!!email && !!password))
        return res.status(401).json({ error: "Invalid input" });

    // input sanitization
    email = email.trim();
    password = password.trim();

    userService.authenticate(email, password)
        .then((token) => {
            return res.status(200).json({ token });
        })
        .catch((err) => {
            return res.status(401).json({ error: err.message });
        });
}

// POST::/auth/signup
function signup(req, res) {
    let { name, email, password } = req.body;

    // input validation
    if (!(!!name && !!email && !!password))
        return res.status(401).json({ error: "Invalid input" });

    // input sanitization
    name = name.trim();
    email = email.trim();
    password = password.trim();

    userService.signup(name, email, password)
        .then((userId) => {
            return res.status(200).json({ userId });
        })
        .catch((err) => {
            return res.status(401).json({ error: err.message });
        });
}

module.exports = { login, signup };