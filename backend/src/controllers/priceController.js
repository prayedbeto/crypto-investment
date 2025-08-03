const priceService = require('../services/priceService');

// Obtener precios actualizados de todas las criptomonedas registradas
const getLatestPrices = async (req, res) => {
  try {
    const result = await priceService.fetchPricesForRegisteredCryptos();
    
    res.json({
      success: true,
      message: result.message,
      data: result.data,
      count: result.count
    });
  } catch (error) {
    console.error('Error al obtener precios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener datos de precios',
      error: error.message
    });
  }
};

// Obtener precio actualizado de una criptomoneda específica
const getPriceForCrypto = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await priceService.fetchPriceForCrypto(parseInt(id));
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error al obtener precio de criptomoneda:', error);
    res.status(404).json({
      success: false,
      message: error.message || 'Error al obtener datos de precio'
    });
  }
};

// Obtener top performers (ganadores y perdedores)
const getTopPerformers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const result = await priceService.fetchTopPerformers(limit);
    
    res.json({
      success: true,
      message: result.message,
      data: {
        gainers: result.gainers,
        losers: result.losers
      },
      count: result.count
    });
  } catch (error) {
    console.error('Error al obtener top performers:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener top performers',
      error: error.message
    });
  }
};

// Obtener solo los ganadores
const getTopGainers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const result = await priceService.fetchTopPerformers(limit);
    
    res.json({
      success: true,
      message: 'Top ganadores obtenidos exitosamente',
      data: result.gainers,
      count: result.count.gainers
    });
  } catch (error) {
    console.error('Error al obtener top ganadores:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener top ganadores',
      error: error.message
    });
  }
};

// Obtener solo los perdedores
const getTopLosers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const result = await priceService.fetchTopPerformers(limit);
    
    res.json({
      success: true,
      message: 'Top perdedores obtenidos exitosamente',
      data: result.losers,
      count: result.count.losers
    });
  } catch (error) {
    console.error('Error al obtener top perdedores:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener top perdedores',
      error: error.message
    });
  }
};

// Obtener estadísticas del mercado
const getMarketStats = async (req, res) => {
  try {
    const result = await priceService.fetchMarketStats();
    
    res.json({
      success: true,
      message: result.message,
      data: result
    });
  } catch (error) {
    console.error('Error al obtener estadísticas del mercado:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas del mercado',
      error: error.message
    });
  }
};

// Obtener precios por símbolos específicos (convertir símbolos a IDs)
const getPricesBySymbols = async (req, res) => {
  try {
    const { symbols } = req.query;
    
    if (!symbols) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere el parámetro symbols (separado por comas)'
      });
    }

    const symbolArray = symbols.split(',').map(s => s.trim().toUpperCase());
    
    // Buscar las criptomonedas en la BD para obtener sus IDs
    const { Cryptocurrency } = require('../models');
    const cryptos = await Cryptocurrency.findAll({
      where: { symbol: symbolArray },
      attributes: ['id', 'symbol', 'rank']
    });

    if (cryptos.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron criptomonedas con los símbolos proporcionados'
      });
    }

    // Obtener los IDs de CoinMarketCap
    const cmcIds = cryptos.map(crypto => crypto.rank);
    const result = await priceService.fetchLatestPrices(cmcIds);
    
    res.json({
      success: true,
      message: 'Precios obtenidos exitosamente',
      data: result,
      count: Object.keys(result).length
    });
  } catch (error) {
    console.error('Error al obtener precios por símbolos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener precios por símbolos',
      error: error.message
    });
  }
};

// Obtener precios por IDs específicos
const getPricesByIds = async (req, res) => {
  try {
    const { ids } = req.query;
    
    if (!ids) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere el parámetro ids (separado por comas)'
      });
    }

    const idArray = ids.split(',').map(id => parseInt(id.trim()));
    const result = await priceService.fetchPricesByIds(idArray);
    
    res.json({
      success: true,
      message: 'Precios obtenidos exitosamente',
      data: result,
      count: Object.keys(result).length
    });
  } catch (error) {
    console.error('Error al obtener precios por IDs:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener precios por IDs',
      error: error.message
    });
  }
};

module.exports = {
  getLatestPrices,
  getPriceForCrypto,
  getTopPerformers,
  getTopGainers,
  getTopLosers,
  getMarketStats,
  getPricesBySymbols,
  getPricesByIds
}; 