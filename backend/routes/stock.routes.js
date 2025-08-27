const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stock.controller');
const { authorizeRoles } = require('../middleware/auth.middleware');

// A raktárműveletekhez 'manager' vagy 'employee' szerepkör kell
router.post('/receive/:orderId', authorizeRoles('manager', 'employee'), stockController.receiveStock);
router.post('/move-to-counter', authorizeRoles('manager', 'employee'), stockController.moveToCounter);
router.post('/log-usage', authorizeRoles('manager', 'employee'), stockController.logUsage);

module.exports = router;