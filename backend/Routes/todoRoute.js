const express = require('express');
const todoController = require('../Controllers/todoController');
const router = express.Router();
const todoService = require('../Services/todoService');

// GET request to /todo
router.get('/', (req, res) => {
    const userId = req.user.userId;

    todoService.findByUserId(userId)
        .then((todos) => {
            return res.status(200).json({ todos });
        })
        .catch((err) => {
            return res.status(401).json({ error: err.message });
        });
});

// POST request to /todo
router.post('/', (req, res) => {
    const userId = req.user.userId;
    let { name } = req.body;

    // input validation
    if (!(!!name)) return res.status(401).json({ error: "Invalid input" });

    // input sanitization
    name = name.trim();

    todoService.create({ userId, name, completed: 0, deleted: 0 })
        .then((result) => {
            return res.status(200).json({ todoId: result });
        })
        .catch((err) => {
            return res.status(401).json({ error: err.message });
        })
});

// PUT request to /todo/{id}
router.put('/:id', (req, res) => {
    const userId = req.user.userId;
    const todoId = req.params.id;

    todoService.completeTodo(userId, todoId, 1)
        .then((result) => {
            return res.status(200).json({ todoId: result });
        })
        .catch((err) => {
            return res.status(401).json({ error: err.message });
        });
});

// PUT request to /todo/u/{id}
router.put('/u/:id', (req, res) => {
    const userId = req.user.userId;
    const todoId = req.params.id;
    
    todoService.completeTodo(userId, todoId, 0)
        .then((result) => {
            return res.status(200).json({ todoId: result });
        })
        .catch((err) => {
            return res.status(401).json({ error: err.message });
        });
});

// DELETE request to /todo/{id}
router.delete('/:id', (req, res) => {
    const userId = req.user.userId;
    const todoId = req.params.id;

    todoService.deleteTodo(userId, todoId)
        .then((result) => {
            return res.status(200).json({ todoId: result });
        })
        .catch((err) => {
            return res.status(401).json({ error: err.message });
        });
});

module.exports = router;