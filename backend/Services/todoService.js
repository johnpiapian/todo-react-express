const Todo = require('../Models/Todo');

function findByUserId(userId) {
    return Todo.findByUserId(userId);
}

function create(todo) {
    return Todo.create(todo);
}

function deleteTodo(userId, todoId) {
    return Todo.update({ userId, todoId, deleted: 1 });
}

function completeTodo(userId, todoId, completed) {
    return Todo.update({ userId, todoId, completed });
}

module.exports = { findByUserId, create, deleteTodo, completeTodo }