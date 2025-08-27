const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

// Ide is jönnek majd a védelmi middleware-ek később.

// POST /api/orders - Új rendelés létrehozása
router.post('/', orderController.createOrder);

// POST /api/orders/:id/approve - Rendelés jóváhagyása
router.post('/:id/approve', orderController.approveOrder);

// POST /api/orders/:id/reject - Rendelés elutasítása
router.post('/:id/reject', orderController.rejectOrder);


module.exports = router;