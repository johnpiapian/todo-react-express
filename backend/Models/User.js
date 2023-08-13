const db = require('../Config/database');

function create(user) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO users (name, email, password) VALUES (?,?,?)';
        db.run(query, [user.name, user.email, user.password], function (err) {
            if (err) {
                if (err.code === 'SQLITE_CONSTRAINT' && err.message.includes('UNIQUE')) {
                    reject(new Error('Email already exists'));
                } else {
                    reject(err);
                }
            } else {
                resolve(this.lastID);
            }
        });
    });
}

function find(userId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users WHERE id = ?';
        db.get(query, [userId], function (err, row) {
            if (err) {
                reject(err);
            } else if (row) {
                resolve(row);
            } else {
                resolve(null);
            }
        });
    });
}

function findByEmail(email) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        db.get(query, [email], function (err, row) {
            if (err) {
                reject(err);
            } else if (row) {
                resolve(row);
            } else {
                resolve(null);
            }
        });
    });
}

function updateByEmail(email, user) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE users SET name = ?, email = ?, password = ? WHERE email = ?';
        db.run(query, [user.name, user.email, user.password, email], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
}

function updateByUserId(userId, user) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE users SET name = ?, email = ?, password = ? WHERE userId = ?';
        db.run(query, [user.name, user.email, user.password, userId], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.changes);
            }
        });
    });
}

module.exports = { create, find, findByEmail, updateByEmail, updateByUserId}