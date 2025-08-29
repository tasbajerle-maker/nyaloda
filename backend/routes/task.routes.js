const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth.middleware');

// Új feladat létrehozása (csak manager)
router.post('/', authenticateToken, authorizeRoles('manager'), taskController.createTask);

// Feladat törlése (csak manager)
router.delete('/:id', authenticateToken, authorizeRoles('manager'), taskController.deleteTask);

// Feladat naplózása (bármely bejelentkezett felhasználó)
router.post('/log', authenticateToken, taskController.logTask);

module.exports = router;