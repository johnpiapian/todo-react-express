const jwtUtil = require('../Utils/Jwt');

function checkAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]

    if (token === null) return res.status(401).json({ error: 'Missing token' });

    const decoded = jwtUtil.verifyToken(token);

    if(decoded) {
        req.user = decoded;
        next();
    } else {
        return res.status(401).json({ error: 'Invalid token' });
    }
}

module.exports = {
    checkAuth
};