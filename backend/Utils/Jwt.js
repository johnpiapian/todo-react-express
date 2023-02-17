const jwt = require('jsonwebtoken');

const jwtSecret = 'yourJwtSecret';

function generateToken(payload) {
  return jwt.sign(payload, jwtSecret, { expiresIn: '1h' });
}

function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, jwtSecret);
    return decoded;
  } catch (err) {
    return null;
  }
}

module.exports = {
  generateToken,
  verifyToken,
};