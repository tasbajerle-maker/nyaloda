const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stock.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Végleges útvonalak
router.post('/receive/:orderId', authenticateToken, stockController.receiveStock);
router.post('/move-to-counter', authenticateToken, stockController.moveToCounter);
router.post('/log-usage', authenticateToken, stockController.logUsage);
router.post('/log-raw-material-usage', authenticateToken, stockController.logRawMaterialUsage);
router.post('/use-from-counter', authenticateToken, stockController.useFromCounter);
router.post('/move-from-counter-to-back', authenticateToken, stockController.moveFromCounterToBack);

module.exports = router;