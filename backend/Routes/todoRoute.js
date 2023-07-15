const express = require('express');
const todoController = require('../Controllers/todoController');
const router = express.Router();

// GET request to /todo
router.get('/', todoController.getTodos);

// POST request to /todo
router.post('/', todoController.createTodo);

// PUT request to /todo/{id}
router.put('/:id', todoController.completeTodo);

// PUT request to /todo/u/{id}
router.put('/u/:id', todoController.uncompleteTodo);

// DELETE request to /todo/{id}
router.delete('/:id', todoController.deleteTodo);

module.exports = router;