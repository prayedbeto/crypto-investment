const { Cryptocurrency, CryptocurrencyPrice } = require('../models');
const priceUpdateService = require('../services/priceUpdateService');
const { Op } = require('sequelize');

// Obtener datos históricos de precios para una criptomoneda
const getHistoricalPrices = async (req, res) => {
  try {
    const { id } = req.params;
    const { days = 7, interval = '1h' } = req.query;

    // Validar que la criptomoneda existe
    const crypto = await Cryptocurrency.findByPk(id);
    if (!crypto) {
      return res.status(404).json({
        success: false,
        message: 'Criptomoneda no encontrada'
      });
    }

    // Calcular fecha de inicio
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Construir consulta base
    let whereClause = {
      cryptocurrency_id: id,
      recorded_at: {
        [Op.gte]: startDate
      }
    };

    // Aplicar filtro por intervalo si se especifica
    let orderClause = [['recorded_at', 'ASC']];
    let attributes = ['id', 'price', 'market_cap', 'volume_24h', 'recorded_at'];

    if (interval === '1h') {
      // Datos por hora (último registro de cada hora)
      attributes.push([
        require('sequelize').literal('DATE_FORMAT(recorded_at, "%Y-%m-%d %H:00:00")'),
        'hour'
      ]);
    } else if (interval === '1d') {
      // Datos por día (último registro de cada día)
      attributes.push([
        require('sequelize').literal('DATE(recorded_at)'),
        'day'
      ]);
    }

    const historicalData = await CryptocurrencyPrice.findAll({
      where: whereClause,
      attributes,
      order: orderClause
    });

    res.json({
      success: true,
      data: {
        cryptocurrency: {
          id: crypto.id,
          name: crypto.name,
          symbol: crypto.symbol
        },
        historical_prices: historicalData,
        count: historicalData.length,
        period: `${days} días`,
        interval: interval
      }
    });
  } catch (error) {
    console.error('Error al obtener datos históricos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener datos históricos',
      error: error.message
    });
  }
};

// Obtener datos históricos de precios para múltiples criptomonedas
const getMultipleHistoricalPrices = async (req, res) => {
  try {
    const { ids } = req.query;
    const { days = 7 } = req.query;

    if (!ids) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere el parámetro ids (separado por comas)'
      });
    }

    const cryptoIds = ids.split(',').map(id => parseInt(id.trim()));
    
    // Calcular fecha de inicio
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const historicalData = await CryptocurrencyPrice.findAll({
      where: {
        cryptocurrency_id: {
          [Op.in]: cryptoIds
        },
        recorded_at: {
          [Op.gte]: startDate
        }
      },
      include: [{
        model: Cryptocurrency,
        as: 'cryptocurrency',
        attributes: ['id', 'name', 'symbol']
      }],
      order: [['recorded_at', 'ASC']]
    });

    // Agrupar datos por criptomoneda
    const groupedData = {};
    historicalData.forEach(record => {
      const cryptoId = record.cryptocurrency_id;
      if (!groupedData[cryptoId]) {
        groupedData[cryptoId] = {
          cryptocurrency: record.cryptocurrency,
          prices: []
        };
      }
      groupedData[cryptoId].prices.push({
        price: record.price,
        market_cap: record.market_cap,
        volume_24h: record.volume_24h,
        recorded_at: record.recorded_at
      });
    });

    res.json({
      success: true,
      data: groupedData,
      count: Object.keys(groupedData).length,
      period: `${days} días`
    });
  } catch (error) {
    console.error('Error al obtener datos históricos múltiples:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener datos históricos múltiples',
      error: error.message
    });
  }
};

// Iniciar actualización automática de precios
const startAutoUpdate = async (req, res) => {
  try {
    const { interval = 1 } = req.body; // intervalo en minutos
    
    priceUpdateService.startAutoUpdate(parseInt(interval));
    
    res.json({
      success: true,
      message: `Actualización automática iniciada cada ${interval} minuto(s)`,
      status: priceUpdateService.getStatus()
    });
  } catch (error) {
    console.error('Error al iniciar actualización automática:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar actualización automática',
      error: error.message
    });
  }
};

// Detener actualización automática de precios
const stopAutoUpdate = async (req, res) => {
  try {
    priceUpdateService.stopAutoUpdate();
    
    res.json({
      success: true,
      message: 'Actualización automática detenida',
      status: priceUpdateService.getStatus()
    });
  } catch (error) {
    console.error('Error al detener actualización automática:', error);
    res.status(500).json({
      success: false,
      message: 'Error al detener actualización automática',
      error: error.message
    });
  }
};

// Obtener estado del servicio de actualización
const getUpdateStatus = async (req, res) => {
  try {
    const status = priceUpdateService.getStatus();
    const stats = await priceUpdateService.getHistoricalStats();
    
    res.json({
      success: true,
      data: {
        status,
        stats
      }
    });
  } catch (error) {
    console.error('Error al obtener estado del servicio:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estado del servicio',
      error: error.message
    });
  }
};

// Limpiar datos históricos antiguos
const cleanupOldData = async (req, res) => {
  try {
    const { daysToKeep = 30 } = req.body;
    
    const deletedCount = await priceUpdateService.cleanupOldData(parseInt(daysToKeep));
    
    res.json({
      success: true,
      message: `Limpieza completada: ${deletedCount} registros eliminados`,
      deletedCount
    });
  } catch (error) {
    console.error('Error al limpiar datos antiguos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al limpiar datos antiguos',
      error: error.message
    });
  }
};

// Forzar actualización manual de precios
const forceUpdate = async (req, res) => {
  try {
    console.log('🔄 Forzando actualización manual de precios...');
    
    // Ejecutar actualización manual
    await priceUpdateService.updatePrices();
    
    // Obtener estadísticas después de la actualización
    const stats = await priceUpdateService.getHistoricalStats();
    
    res.json({
      success: true,
      message: 'Actualización manual completada',
      stats
    });
  } catch (error) {
    console.error('Error en actualización manual:', error);
    res.status(500).json({
      success: false,
      message: 'Error en actualización manual',
      error: error.message
    });
  }
};

// Obtener estadísticas de datos históricos
const getHistoricalStats = async (req, res) => {
  try {
    const stats = await priceUpdateService.getHistoricalStats();
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error al obtener estadísticas históricas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas históricas',
      error: error.message
    });
  }
};

// Obtener reporte detallado de criptomonedas y sus datos de precio
const getCryptoPriceReport = async (req, res) => {
  try {
    const { Cryptocurrency, CryptocurrencyPrice } = require('../models');
    
    // Obtener todas las criptomonedas registradas
    const registeredCryptos = await Cryptocurrency.findAll({
      where: { is_active: true },
      order: [['rank', 'ASC']]
    });

    // Obtener estadísticas de precios por criptomoneda
    const priceStats = await CryptocurrencyPrice.findAll({
      attributes: [
        'cryptocurrency_id',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'price_count'],
        [require('sequelize').fn('MAX', require('sequelize').col('recorded_at')), 'last_update']
      ],
      group: ['cryptocurrency_id']
    });

    // Crear mapa de estadísticas
    const statsMap = {};
    priceStats.forEach(stat => {
      statsMap[stat.cryptocurrency_id] = {
        price_count: parseInt(stat.dataValues.price_count),
        last_update: stat.dataValues.last_update
      };
    });

    // Crear reporte
    const report = registeredCryptos.map(crypto => {
      const stats = statsMap[crypto.id] || { price_count: 0, last_update: null };
      const hasRecentData = stats.last_update && 
        (new Date() - new Date(stats.last_update)) < 24 * 60 * 60 * 1000; // Últimas 24 horas
      
      return {
        id: crypto.id,
        rank: crypto.rank,
        symbol: crypto.symbol,
        name: crypto.name,
        is_active: crypto.is_active,
        price_count: stats.price_count,
        last_update: stats.last_update,
        has_recent_data: hasRecentData,
        status: crypto.rank <= 100 ? 'En API' : 'Fuera de API',
        can_update: crypto.rank <= 100
      };
    });

    // Agrupar por estado
    const summary = {
      total_cryptocurrencies: report.length,
      in_api: report.filter(c => c.can_update).length,
      out_of_api: report.filter(c => !c.can_update).length,
      with_recent_data: report.filter(c => c.has_recent_data).length,
      without_recent_data: report.filter(c => !c.has_recent_data).length
    };

    res.json({
      success: true,
      data: {
        summary,
        cryptocurrencies: report
      }
    });
  } catch (error) {
    console.error('Error al obtener reporte de criptomonedas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener reporte de criptomonedas',
      error: error.message
    });
  }
};

module.exports = {
  getHistoricalPrices,
  getMultipleHistoricalPrices,
  startAutoUpdate,
  stopAutoUpdate,
  getUpdateStatus,
  cleanupOldData,
  forceUpdate,
  getHistoricalStats,
  getCryptoPriceReport
}; 