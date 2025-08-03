const { Cryptocurrency, CryptocurrencyMetadata } = require('../models');
const cryptocurrencyService = require('../services/cryptocurrencyService');

// Obtener todas las criptomonedas
const getAllCryptocurrencies = async (req, res) => {
  try {
    const cryptocurrencies = await Cryptocurrency.findAll({
      order: [['rank', 'ASC']]
    });
    
    res.json({
      success: true,
      data: cryptocurrencies,
      count: cryptocurrencies.length
    });
  } catch (error) {
    console.error('Error al obtener criptomonedas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener una criptomoneda por ID
const getCryptocurrencyById = async (req, res) => {
  try {
    const { id } = req.params;
    const cryptocurrency = await Cryptocurrency.findByPk(id);
    
    if (!cryptocurrency) {
      return res.status(404).json({
        success: false,
        message: 'Criptomoneda no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: cryptocurrency
    });
  } catch (error) {
    console.error('Error al obtener criptomoneda:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener criptomonedas por símbolo
const getCryptocurrencyBySymbol = async (req, res) => {
  try {
    const { symbol } = req.params;
    const cryptocurrency = await Cryptocurrency.findOne({
      where: { symbol: symbol.toUpperCase() }
    });
    
    if (!cryptocurrency) {
      return res.status(404).json({
        success: false,
        message: 'Criptomoneda no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: cryptocurrency
    });
  } catch (error) {
    console.error('Error al obtener criptomoneda por símbolo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener criptomonedas activas
const getActiveCryptocurrencies = async (req, res) => {
  try {
    const cryptocurrencies = await Cryptocurrency.findAll({
      where: { is_active: true },
      order: [['rank', 'ASC']]
    });
    
    res.json({
      success: true,
      data: cryptocurrencies,
      count: cryptocurrencies.length
    });
  } catch (error) {
    console.error('Error al obtener criptomonedas activas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener datos de una API externa y guardarlos en la base de datos
const fetchAndSaveCryptocurrencies = async (req, res) => {
  try {
    const result = await cryptocurrencyService.fetchAndSaveAllData();
    
    res.json({
      success: true,
      message: result.message,
      data: result
    });
    
  } catch (error) {
    console.error('Error al obtener y guardar criptomonedas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener datos de la API externa',
      error: error.message
    });
  }
};

// Obtener metadatos de una criptomoneda
const getCryptocurrencyMetadata = async (req, res) => {
  try {
    const { id } = req.params;
    const metadata = await CryptocurrencyMetadata.findOne({
      where: { cryptocurrency_id: id },
      include: [{
        model: Cryptocurrency,
        as: 'cryptocurrency'
      }]
    });
    
    if (!metadata) {
      return res.status(404).json({
        success: false,
        message: 'Metadatos no encontrados'
      });
    }
    
    res.json({
      success: true,
      data: metadata
    });
  } catch (error) {
    console.error('Error al obtener metadatos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener todas las criptomonedas con sus metadatos
const getAllCryptocurrenciesWithMetadata = async (req, res) => {
  try {
    const cryptocurrencies = await Cryptocurrency.findAll({
      include: [{
        model: CryptocurrencyMetadata,
        as: 'metadata'
      }],
      order: [['rank', 'ASC']]
    });
    
    res.json({
      success: true,
      data: cryptocurrencies,
      count: cryptocurrencies.length
    });
  } catch (error) {
    console.error('Error al obtener criptomonedas con metadatos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  getAllCryptocurrencies,
  getCryptocurrencyById,
  getCryptocurrencyBySymbol,
  getActiveCryptocurrencies,
  fetchAndSaveCryptocurrencies,
  getCryptocurrencyMetadata,
  getAllCryptocurrenciesWithMetadata
}; 