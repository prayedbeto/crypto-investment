const express = require('express');
const router = express.Router();
const {
  getAllCryptocurrencies,
  getCryptocurrencyById,
  getCryptocurrencyBySymbol,
  getActiveCryptocurrencies,
  fetchAndSaveCryptocurrencies,
  getCryptocurrencyMetadata,
  getAllCryptocurrenciesWithMetadata,
  searchCryptocurrencies
} = require('../controllers/cryptocurrencyController');

// Obtener todas las criptomonedas (con búsqueda opcional)
router.get('/', getAllCryptocurrencies);

// Buscar criptomonedas con filtros avanzados
router.get('/search', searchCryptocurrencies);

// Obtener criptomonedas activas
router.get('/active', getActiveCryptocurrencies);

// Obtener una criptomoneda por ID
router.get('/:id', getCryptocurrencyById);

// Obtener una criptomoneda por símbolo
router.get('/symbol/:symbol', getCryptocurrencyBySymbol);

// Obtener metadatos de una criptomoneda
router.get('/:id/metadata', getCryptocurrencyMetadata);

// Obtener todas las criptomonedas con metadatos
router.get('/with-metadata', getAllCryptocurrenciesWithMetadata);

// Obtener datos de API externa y guardarlos
router.post('/fetch', fetchAndSaveCryptocurrencies);

module.exports = router; 