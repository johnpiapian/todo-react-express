const todoService = require('../Services/todoService');

function getTodos(req, res) {
    const userId = req.user.userId;

    todoService.findByUserId(userId)
        .then((todos) => {
            return res.json(todos);
        })
        .catch((err) => {
            return res.status(401).json({ error: err.message });
        });
}

function createTodo(req, res) {
    const userId = req.user.userId;
    let { name } = req.body;

    // input validation
    if (!(!!name)) return res.status(401).json({ error: "Invalid input" });

    // input sanitization
    name = name.trim();

    todoService.create({ userId, name, completed: 0, deleted: 0 })
        .then((result) => {
            return res.status(200).json({ result });
        })
        .catch((err) => {
            return res.status(401).json({ error: err.message });
        })
}

function completeTodo(req, res) {
    const userId = req.user.userId;
    const todoId = req.params.id;

    todoService.completeTodo(userId, todoId, 1)
        .then((result) => {
            return res.json(result);
        })
        .catch((err) => {
            return res.status(401).json({ error: err.message });
        });
}

function uncompleteTodo(req, res) {
    const userId = req.user.userId;
    const todoId = req.params.id;
    
    todoService.completeTodo(userId, todoId, 0)
        .then((result) => {
            return res.json(result);
        })
        .catch((err) => {
            return res.status(401).json({ error: err.message });
        });
}

function deleteTodo(req, res) {
    const userId = req.user.userId;
    const todoId = req.params.id;

    todoService.deleteTodo(userId, todoId)
        .then((result) => {
            return res.json(result);
        })
        .catch((err) => {
            return res.status(401).json({ error: err.message });
        });
}

module.exports = { getTodos, createTodo, deleteTodo, completeTodo, uncompleteTodo }