const jwtUtil = require('../Utils/Jwt');

function checkAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]

    if (token === null) return res.status(401).json({ message: 'Missing token' });

    try {
        const decoded = jwtUtil.verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}

module.exports = {
    checkAuth
};