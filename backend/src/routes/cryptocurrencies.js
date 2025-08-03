const express = require('express');
const router = express.Router();
const {
  getAllCryptocurrencies,
  getCryptocurrencyById,
  getCryptocurrencyBySymbol,
  getActiveCryptocurrencies,
  fetchAndSaveCryptocurrencies,
  getCryptocurrencyMetadata,
  getAllCryptocurrenciesWithMetadata
} = require('../controllers/cryptocurrencyController');

// Obtener todas las criptomonedas
router.get('/', getAllCryptocurrencies);

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