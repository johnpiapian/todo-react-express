const db = require('../Config/database');

// find all todos belong to userId
function findByUserId(userId) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT todoId, name, completed FROM todos WHERE userId = ? AND deleted = 0';
        db.all(query, [userId], function (err, rows) {
            if (err) {
                reject(err);
            } else if (rows) {
                resolve(rows);
            } else {
                resolve(null);
            }
        });
    });
}

// create todo
function create(todo) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO todos (userId, name, completed, deleted) VALUES (?, ?, ?, ?)';
        db.run(query, [todo.userId, todo.name, todo.completed, todo.deleted], function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(this.lastID);
            }
        });
    });
}

// update todo
function update(todo) {
    return new Promise((resolve, reject) => {
        let query = 'UPDATE todos SET ';
        let values = [];

        // check if each field was provided and add it to the update query
        if (todo.name) {
            query += 'name = ?, ';
            values.push(todo.name);
        }
        if (todo.completed !== undefined) {
            query += 'completed = ?, ';
            values.push(todo.completed);
        }
        if (todo.deleted !== undefined) {
            query += 'deleted = ?, ';
            values.push(todo.deleted);
        }

        // remove the trailing comma and space from the update query
        query = query.slice(0, -2);

        // add the WHERE clause to update only the specific todo with the given id
        query += ' WHERE todoId = ? AND userId = ? AND deleted = 0';
        values.push(todo.todoId);
        values.push(todo.userId);

        db.run(query, values, function (err) {
            if (err) {
                reject(err);
            } else if (this.changes === 0) {
                reject(new Error('Todo not found'));
            } else if (this.changes === 1) {
                resolve(this.lastID);
            } else {
                resolve(null);
            }
        });
    });
}

module.exports = { findByUserId, create, update }