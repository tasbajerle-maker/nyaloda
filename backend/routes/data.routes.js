const express = require('express');
const router = express.Router();
const dataController = require('../controllers/data.controller');

// GET /api/data - Az összes induló adat lekérése
router.get('/', dataController.getAllData);

module.exports = router;