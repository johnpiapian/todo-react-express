const jwtUtil = require('../Utils/Jwt');
const userService = require('./userService');

function authenticate(email, password) {
    return userService.findByEmail(email)
        .then((user) => {
            if (user && user.password === password) {
                return jwtUtil.generateToken(user);
            } else {
                throw new Error('Invalid email or password');
            }
        });
}

function signup(name, email, password) {
    return userService.create({ name, email, password })
        .then((userId) => {
            if (userId) {
                return userId;
            } else {
                throw new Error('Error occurred while signing up');
            }
        });
}

module.exports = { authenticate, signup }