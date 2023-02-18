var sqlite3 = require('sqlite3').verbose();

const DBSOURCE = "db.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message)
        throw err
    } else {
        console.log('Connected to the SQLite database.');

        db.run(`CREATE TABLE users (
            userId INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL, 
            email TEXT UNIQUE, 
            password TEXT NOT NULL, 
            CONSTRAINT email_unique UNIQUE (email)
            )`,
            (err) => {
                if (err) {
                    // Table already created
                } else {
                    // Table just created, creating some rows
                }
            });

        db.run(`CREATE TABLE todos (
                todoId INTEGER PRIMARY KEY AUTOINCREMENT,
                userId INTEGER,
                name TEXT NOT NULL,
                completed INTEGER,
                deleted INTEGER,
                FOREIGN KEY(userId) REFERENCES users(userId)
                )`,
            (err) => {
                if (err) {
                    // Table already created
                } else {
                    // Table just created, creating some rows
                }
            });

    }
});


module.exports = db