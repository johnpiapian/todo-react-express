const jwtUtil = require('../Utils/Jwt');
const bcryptUtil = require('../Utils/Bcrypt');
const userService = require('./userService');

function authenticate(email, password) {
    return userService.findByEmail(email)
        .then(async (user) => {
            let passwordVerified = await bcryptUtil.comparePassword(password, user.password);
            if (user && passwordVerified) {
                let { userId, name, email } = user;

                return jwtUtil.generateToken({ userId, name, email });
            } else {
                throw new Error('Invalid email or password');
            }
        });
}

async function signup(name, email, password) {
    password = await bcryptUtil.hashPassword(password);

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