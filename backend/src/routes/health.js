const express = require('express');
const router = express.Router();
const { getHealth } = require('../controllers/healthController');

// Ruta de salud
router.get('/', getHealth);

module.exports = router; 