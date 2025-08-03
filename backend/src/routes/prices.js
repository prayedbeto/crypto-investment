const express = require('express');
const router = express.Router();
const {
  getLatestPrices,
  getPriceForCrypto,
  getTopPerformers,
  getTopGainers,
  getTopLosers,
  getMarketStats,
  getPricesBySymbols,
  getPricesByIds
} = require('../controllers/priceController');

// Obtener precios actualizados de todas las criptomonedas registradas
router.get('/', getLatestPrices);

// Obtener precio de una criptomoneda específica por ID
router.get('/crypto/:id', getPriceForCrypto);

// Obtener top performers (ganadores y perdedores)
router.get('/top-performers', getTopPerformers);

// Obtener solo los ganadores
router.get('/top-gainers', getTopGainers);

// Obtener solo los perdedores
router.get('/top-losers', getTopLosers);

// Obtener estadísticas del mercado
router.get('/market-stats', getMarketStats);

// Obtener precios por símbolos específicos (convertidos a IDs internamente)
router.get('/by-symbols', getPricesBySymbols);

// Obtener precios por IDs específicos de CoinMarketCap
router.get('/by-ids', getPricesByIds);

module.exports = router; 