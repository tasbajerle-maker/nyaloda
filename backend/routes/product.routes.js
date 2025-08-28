const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticateToken, authorizeRoles } = require('../middleware/auth.middleware');

// Először az 'authenticateToken' fut le, ami beteszi a felhasználót a req.user-be.
// Utána az 'authorizeRoles' ellenőrzi a jogosultságot.
router.post('/', authenticateToken, authorizeRoles('manager'), productController.createProduct);
router.patch('/:id', authenticateToken, authorizeRoles('manager'), productController.updateProduct);
router.delete('/:id', authenticateToken, authorizeRoles('manager'), productController.deleteProduct);
router.post('/receive-by-barcode', authenticateToken, authorizeRoles('manager'), productController.receiveProductByBarcode);

// Ez az a sor, ami valószínűleg hiányzott vagy hibás volt:
router.post('/waste', authenticateToken, authorizeRoles('manager'), productController.wasteProduct);

module.exports = router;