const User = require('../Models/User');

function create(user) {
    // make email case-insensitive
    user.email = user.email.toLowerCase();
    return User.create(user);
}

function findById(userId) {
    return User.find(userId);
}

function findByEmail(email) {
    // make email case-insensitive
    email = email.toLowerCase();
    return User.findByEmail(email);
}

function updateByEmail(email, user) {
    // make email case-insensitive
    email = email.toLowerCase();
    return User.updateByEmail(email, user);
}

module.exports = { create, findByEmail, findById, updateByEmail }