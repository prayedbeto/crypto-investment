const express = require('express');
const router = express.Router();
const {
  getHistoricalPrices,
  getMultipleHistoricalPrices,
  startAutoUpdate,
  stopAutoUpdate,
  getUpdateStatus,
  cleanupOldData,
  forceUpdate,
  getHistoricalStats,
  getCryptoPriceReport
} = require('../controllers/historicalPriceController');

// Obtener datos históricos de una criptomoneda específica
router.get('/prices/:id', getHistoricalPrices);

// Obtener datos históricos de múltiples criptomonedas
router.get('/prices', getMultipleHistoricalPrices);

// Obtener estadísticas de datos históricos
router.get('/stats', getHistoricalStats);

// Obtener reporte detallado de criptomonedas y precios
router.get('/report', getCryptoPriceReport);

// Obtener estado del servicio de actualización
router.get('/status', getUpdateStatus);

// Iniciar actualización automática de precios
router.post('/start-update', startAutoUpdate);

// Detener actualización automática de precios
router.post('/stop-update', stopAutoUpdate);

// Limpiar datos históricos antiguos
router.post('/cleanup', cleanupOldData);

// Forzar actualización manual de precios
router.post('/force-update', forceUpdate);

module.exports = router; 