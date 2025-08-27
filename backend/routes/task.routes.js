const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { authorizeRoles } = require('../middleware/auth.middleware');

// Feladat létrehozása és törlése csak 'manager'
router.post('/', authorizeRoles('manager'), taskController.createTask);
router.delete('/:id', authorizeRoles('manager'), taskController.deleteTask);

// Feladat elvégzésének naplózása 'manager' és 'employee' által is
router.post('/log', authorizeRoles('manager', 'employee'), taskController.logTask);

module.exports = router;