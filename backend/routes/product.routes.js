const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authorizeRoles } = require('../middleware/auth.middleware');

// Minden termék-művelet csak 'manager' szerepkörrel érhető el
router.post('/', authorizeRoles('manager'), productController.createProduct);
router.patch('/:id', authorizeRoles('manager'), productController.updateProduct);
router.delete('/:id', authorizeRoles('manager'), productController.deleteProduct);

module.exports = router;