const bcrypt = require('bcrypt');

function hashPassword(plainTextPassword) {
    return bcrypt.hash(plainTextPassword, 10);
}

function comparePassword(plainTextPassword, hashedPassword) {
    return bcrypt.compare(plainTextPassword, hashedPassword);
}

module.exports = { hashPassword, comparePassword }