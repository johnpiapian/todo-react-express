const jwt = require('jsonwebtoken');
const jwtSecret = 'yourJwtSecret';

function generateToken(payload, expiresIn = '1h') {
  if (!payload?.type) payload.type = 'access';

  return jwt.sign(payload, jwtSecret, { expiresIn: expiresIn});
}

function verifyToken(token, type = 'access') {
  try {
    const decoded = jwt.verify(token, jwtSecret);
    if (decoded.type !== type) return null;
    
    return decoded;
  } catch (err) {
    return null;
  }
}

module.exports = {
  generateToken,
  verifyToken,
};