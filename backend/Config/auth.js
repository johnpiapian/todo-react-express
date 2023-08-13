const jwtUtil = require('../Utils/Jwt');

function validateHeader(header) {
    const token = header && header.split(' ')[1];
    if (token === null) return null;

    const decoded = jwtUtil.verifyToken(token);
    if(decoded) return decoded;

    return null;
}

function checkAuth(req, res, next) {
    const decoded = validateHeader(req.headers.authorization);

    if (decoded !== null && decoded.type === 'access') {
        req.user = decoded;
        next();
        return;
    }

    return res.status(401).json({ error: 'Invalid token' });
}

function checkAuthPasswordReset(req, res, next) {
    const decoded = validateHeader(req.headers.authorization);

    if (decoded !== null && decoded.type === 'reset') {
        req.user = decoded;
        next();
        return;
    }

    return res.status(401).json({ error: 'Invalid token' });
}

module.exports = { checkAuth, checkAuthPasswordReset};