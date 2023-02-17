const User = require('../Models/User');

function create(user) {
    return User.create(user);
}

function findById(userId) {
    return User.find(userId);
}

function findByEmail(email) {
    return User.findByEmail(email);
}

module.exports = { create, findByEmail, findById }