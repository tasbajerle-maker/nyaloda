const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authorizeRoles } = require('../middleware/auth.middleware');

// A felhasználó-kezelés minden része csak 'manager' szerepkörrel érhető el
router.get('/', authorizeRoles('manager'), userController.getAllUsers);
router.post('/', authorizeRoles('manager'), userController.createUser);
router.patch('/:id', authorizeRoles('manager'), userController.updateUser);
router.delete('/:id', authorizeRoles('manager'), userController.deleteUser);

module.exports = router;