const { Cryptocurrency, CryptocurrencyMetadata } = require('../models');
const { Op } = require('sequelize');
const cryptocurrencyService = require('../services/cryptocurrencyService');

// Obtener todas las criptomonedas
const getAllCryptocurrencies = async (req, res) => {
  try {
    const { search, limit, offset } = req.query;
    
    // Construir las condiciones de búsqueda
    let queryOptions = {
      order: [['rank', 'ASC']]
    };

    // Si hay parámetro de búsqueda, agregar filtros
    if (search && search.trim() !== '') {
      const searchTerm = search.trim();
      queryOptions.where = {
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${searchTerm}%`
            }
          },
          {
            symbol: {
              [Op.like]: `%${searchTerm.toUpperCase()}%`
            }
          },
          {
            slug: {
              [Op.like]: `%${searchTerm.toLowerCase()}%`
            }
          }
        ]
      };
    }

    // Agregar paginación si se proporcionan los parámetros
    if (limit) {
      queryOptions.limit = parseInt(limit);
    }
    
    if (offset) {
      queryOptions.offset = parseInt(offset);
    }

    const cryptocurrencies = await Cryptocurrency.findAll(queryOptions);
    
    // Obtener el total de registros que coinciden con los filtros
    let totalCount = cryptocurrencies.length;
    if (search || limit || offset) {
      const totalResult = await Cryptocurrency.count({
        where: queryOptions.where || {}
      });
      totalCount = totalResult;
    }
    
    res.json({
      success: true,
      data: cryptocurrencies,
      count: cryptocurrencies.length,
      total: totalCount,
      search: search || null,
      pagination: {
        limit: queryOptions.limit || null,
        offset: queryOptions.offset || null,
        totalPages: queryOptions.limit ? Math.ceil(totalCount / queryOptions.limit) : 1,
        currentPage: queryOptions.offset && queryOptions.limit ? Math.floor(queryOptions.offset / queryOptions.limit) + 1 : 1
      }
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

// Buscar criptomonedas con filtros avanzados
const searchCryptocurrencies = async (req, res) => {
  try {
    const { 
      search, 
      minRank, 
      maxRank, 
      isActive, 
      limit = 20, 
      offset = 0,
      sortBy = 'rank',
      sortOrder = 'ASC'
    } = req.query;

    // Construir las condiciones de búsqueda
    let whereClause = {};

    // Búsqueda por texto
    if (search && search.trim() !== '') {
      const searchTerm = search.trim();
      whereClause[Op.or] = [
        {
          name: {
            [Op.like]: `%${searchTerm}%`
          }
        },
        {
          symbol: {
            [Op.like]: `%${searchTerm.toUpperCase()}%`
          }
        },
        {
          slug: {
            [Op.like]: `%${searchTerm.toLowerCase()}%`
          }
        }
      ];
    }

    // Filtro por rango de ranking
    if (minRank || maxRank) {
      whereClause.rank = {};
      if (minRank) whereClause.rank[Op.gte] = parseInt(minRank);
      if (maxRank) whereClause.rank[Op.lte] = parseInt(maxRank);
    }

    // Filtro por estado activo
    if (isActive !== undefined) {
      whereClause.is_active = isActive === 'true';
    }

    // Validar y configurar ordenamiento
    const allowedSortFields = ['rank', 'name', 'symbol', 'createdAt', 'updatedAt'];
    const allowedSortOrders = ['ASC', 'DESC'];
    
    const finalSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'rank';
    const finalSortOrder = allowedSortOrders.includes(sortOrder.toUpperCase()) ? sortOrder.toUpperCase() : 'ASC';

    const queryOptions = {
      where: whereClause,
      order: [[finalSortBy, finalSortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    };

    const [cryptocurrencies, totalCount] = await Promise.all([
      Cryptocurrency.findAll(queryOptions),
      Cryptocurrency.count({ where: whereClause })
    ]);

    res.json({
      success: true,
      data: cryptocurrencies,
      count: cryptocurrencies.length,
      total: totalCount,
      filters: {
        search: search || null,
        minRank: minRank || null,
        maxRank: maxRank || null,
        isActive: isActive !== undefined ? isActive === 'true' : null
      },
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        currentPage: Math.floor(parseInt(offset) / parseInt(limit)) + 1
      },
      sorting: {
        field: finalSortBy,
        order: finalSortOrder
      }
    });

  } catch (error) {
    console.error('Error al buscar criptomonedas:', error);
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
  getAllCryptocurrenciesWithMetadata,
  searchCryptocurrencies
}; 