const express = require('express');
const todoController = require('../controllers/todoController');
const router = express.Router();

// GET request to /todo/ to get users todos
router.get('/', todoController.getData);

module.exports = router;