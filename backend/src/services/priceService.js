const axios = require('axios');
const { Cryptocurrency } = require('../models');

class PriceService {
  constructor() {
    this.apiUrl = process.env.COINMARKETCAP_API_URL;
    this.apiKey = process.env.COINMARKETCAP_API_KEY;
  }

  // Obtener precios actualizados de criptomonedas por IDs
  async fetchLatestPrices(ids = null) {
    try {
      let url = `${this.apiUrl}/v2/cryptocurrency/quotes/latest`;
      
      // Si se proporcionan IDs específicos, usarlos
      if (ids && ids.length > 0) {
        const idString = ids.join(',');
        url += `?id=${idString}`;
      } else {
        // Obtener las primeras 100 criptomonedas por defecto
        url += '?limit=100';
      }

      const response = await axios.get(url, {
        headers: {
          'X-CMC_PRO_API_KEY': this.apiKey
        }
      });

      return response.data.data;
    } catch (error) {
      console.error('Error al obtener precios:', error.response?.data || error.message);
      throw new Error('Error al obtener datos de precios de CoinMarketCap');
    }
  }

  // Obtener datos de precios por ID de criptomoneda (método específico)
  async fetchPricesByIds(ids) {
    try {
      const idArray = Array.isArray(ids) ? ids : [ids];
      return await this.fetchLatestPrices(idArray);
    } catch (error) {
      console.error('Error al obtener precios por IDs:', error.response?.data || error.message);
      throw new Error('Error al obtener datos de precios por IDs');
    }
  }

  // Obtener datos de precios para criptomonedas registradas en la BD
  async fetchPricesForRegisteredCryptos() {
    try {
      // Obtener todas las criptomonedas registradas
      const registeredCryptos = await Cryptocurrency.findAll({
        where: { is_active: true },
        order: [['rank', 'ASC']],
        limit: 100 // Limitar a 100 para evitar problemas con la API
      });

      if (registeredCryptos.length === 0) {
        return { data: {}, message: 'No hay criptomonedas registradas' };
      }

      // Obtener los IDs de CoinMarketCap de las criptomonedas registradas
      // Usamos el rank como ID de CoinMarketCap (asumiendo que coincide)
      const cmcIds = registeredCryptos
        .map(crypto => crypto.rank)
        .filter(rank => rank && rank <= 100); // Solo IDs válidos hasta 100
      
      // Obtener precios actualizados
      const pricesData = await this.fetchLatestPrices(cmcIds);

      // Combinar datos de la BD con datos de precios
      const combinedData = {};
      
      for (const crypto of registeredCryptos) {
        // Buscar por ID de CoinMarketCap usando el rank
        const priceInfo = pricesData[crypto.rank];
        if (priceInfo) {
          combinedData[crypto.id] = {
            id: crypto.id,
            name: crypto.name,
            symbol: crypto.symbol,
            slug: crypto.slug,
            rank: crypto.rank,
            // Datos de precios
            price: priceInfo.quote?.USD?.price || 0,
            market_cap: priceInfo.quote?.USD?.market_cap || 0,
            volume_24h: priceInfo.quote?.USD?.volume_24h || 0,
            percent_change_1h: priceInfo.quote?.USD?.percent_change_1h || 0,
            percent_change_24h: priceInfo.quote?.USD?.percent_change_24h || 0,
            percent_change_7d: priceInfo.quote?.USD?.percent_change_7d || 0,
            percent_change_30d: priceInfo.quote?.USD?.percent_change_30d || 0,
            percent_change_60d: priceInfo.quote?.USD?.percent_change_60d || 0,
            percent_change_90d: priceInfo.quote?.USD?.percent_change_90d || 0,
            market_cap_dominance: priceInfo.quote?.USD?.market_cap_dominance || 0,
            fully_diluted_market_cap: priceInfo.quote?.USD?.fully_diluted_market_cap || 0,
            circulating_supply: priceInfo.circulating_supply || 0,
            total_supply: priceInfo.total_supply || 0,
            max_supply: priceInfo.max_supply || null,
            cmc_rank: priceInfo.cmc_rank || 0,
            last_updated: priceInfo.last_updated || new Date().toISOString(),
            // Datos adicionales
            volume_change_24h: priceInfo.quote?.USD?.volume_change_24h || 0,
            // Datos adicionales de la respuesta
            num_market_pairs: priceInfo.num_market_pairs || 0,
            is_active: priceInfo.is_active || 0,
            is_fiat: priceInfo.is_fiat || 0,
            tvl_ratio: priceInfo.tvl_ratio || null,
            tags: priceInfo.tags || []
          };
        }
      }

      return {
        data: combinedData,
        count: Object.keys(combinedData).length,
        message: 'Datos de precios obtenidos exitosamente'
      };
    } catch (error) {
      console.error('Error en fetchPricesForRegisteredCryptos:', error);
      throw error;
    }
  }

  // Obtener datos de precios para una criptomoneda específica
  async fetchPriceForCrypto(cryptoId) {
    try {
      // Obtener la criptomoneda de la BD
      const crypto = await Cryptocurrency.findByPk(cryptoId);
      if (!crypto) {
        throw new Error('Criptomoneda no encontrada');
      }

      // Obtener precio actualizado usando el ID de CoinMarketCap
      const cmcId = crypto.rank;
      const pricesData = await this.fetchLatestPrices([cmcId]);
      const priceInfo = pricesData[cmcId];

      if (!priceInfo) {
        throw new Error('No se pudieron obtener datos de precios para esta criptomoneda');
      }

      return {
        id: crypto.id,
        name: crypto.name,
        symbol: crypto.symbol,
        slug: crypto.slug,
        rank: crypto.rank,
        // Datos de precios
        price: priceInfo.quote?.USD?.price || 0,
        market_cap: priceInfo.quote?.USD?.market_cap || 0,
        volume_24h: priceInfo.quote?.USD?.volume_24h || 0,
        percent_change_1h: priceInfo.quote?.USD?.percent_change_1h || 0,
        percent_change_24h: priceInfo.quote?.USD?.percent_change_24h || 0,
        percent_change_7d: priceInfo.quote?.USD?.percent_change_7d || 0,
        percent_change_30d: priceInfo.quote?.USD?.percent_change_30d || 0,
        percent_change_60d: priceInfo.quote?.USD?.percent_change_60d || 0,
        percent_change_90d: priceInfo.quote?.USD?.percent_change_90d || 0,
        market_cap_dominance: priceInfo.quote?.USD?.market_cap_dominance || 0,
        fully_diluted_market_cap: priceInfo.quote?.USD?.fully_diluted_market_cap || 0,
        circulating_supply: priceInfo.circulating_supply || 0,
        total_supply: priceInfo.total_supply || 0,
        max_supply: priceInfo.max_supply || null,
        cmc_rank: priceInfo.cmc_rank || 0,
        last_updated: priceInfo.last_updated || new Date().toISOString(),
        // Datos adicionales
        volume_change_24h: priceInfo.quote?.USD?.volume_change_24h || 0,
        // Datos adicionales de la respuesta
        num_market_pairs: priceInfo.num_market_pairs || 0,
        is_active: priceInfo.is_active || 0,
        is_fiat: priceInfo.is_fiat || 0,
        tvl_ratio: priceInfo.tvl_ratio || null,
        tags: priceInfo.tags || []
      };
    } catch (error) {
      console.error('Error en fetchPriceForCrypto:', error);
      throw error;
    }
  }

  // Obtener top performers (mejores y peores rendimientos)
  async fetchTopPerformers(limit = 10) {
    try {
      const pricesData = await this.fetchPricesForRegisteredCryptos();
      
      if (!pricesData.data || Object.keys(pricesData.data).length === 0) {
        return { gainers: [], losers: [], message: 'No hay datos disponibles' };
      }

      // Convertir a array y ordenar por cambio porcentual de 24h
      const cryptosArray = Object.values(pricesData.data);
      
      const gainers = cryptosArray
        .filter(crypto => crypto.percent_change_24h > 0)
        .sort((a, b) => b.percent_change_24h - a.percent_change_24h)
        .slice(0, limit);

      const losers = cryptosArray
        .filter(crypto => crypto.percent_change_24h < 0)
        .sort((a, b) => a.percent_change_24h - b.percent_change_24h)
        .slice(0, limit);

      return {
        gainers,
        losers,
        count: { gainers: gainers.length, losers: losers.length },
        message: 'Top performers obtenidos exitosamente'
      };
    } catch (error) {
      console.error('Error en fetchTopPerformers:', error);
      throw error;
    }
  }

  // Obtener estadísticas del mercado
  async fetchMarketStats() {
    try {
      const pricesData = await this.fetchPricesForRegisteredCryptos();
      
      if (!pricesData.data || Object.keys(pricesData.data).length === 0) {
        return { message: 'No hay datos disponibles' };
      }

      const cryptosArray = Object.values(pricesData.data);
      
      const totalMarketCap = cryptosArray.reduce((sum, crypto) => sum + crypto.market_cap, 0);
      const totalVolume24h = cryptosArray.reduce((sum, crypto) => sum + crypto.volume_24h, 0);
      
      const gainers = cryptosArray.filter(crypto => crypto.percent_change_24h > 0).length;
      const losers = cryptosArray.filter(crypto => crypto.percent_change_24h < 0).length;
      const unchanged = cryptosArray.filter(crypto => crypto.percent_change_24h === 0).length;

      return {
        total_cryptocurrencies: cryptosArray.length,
        total_market_cap: totalMarketCap,
        total_volume_24h: totalVolume24h,
        market_sentiment: {
          gainers,
          losers,
          unchanged
        },
        average_change_24h: cryptosArray.reduce((sum, crypto) => sum + crypto.percent_change_24h, 0) / cryptosArray.length,
        message: 'Estadísticas del mercado obtenidas exitosamente'
      };
    } catch (error) {
      console.error('Error en fetchMarketStats:', error);
      throw error;
    }
  }
}

module.exports = new PriceService(); 