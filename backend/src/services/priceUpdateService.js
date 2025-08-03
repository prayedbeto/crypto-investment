const { Cryptocurrency, CryptocurrencyPrice } = require('../models');
const priceService = require('./priceService');

class PriceUpdateService {
  constructor() {
    this.updateInterval = null;
    this.isRunning = false;
  }

  // Iniciar la actualización automática de precios
  startAutoUpdate(intervalMinutes = 1) {
    if (this.isRunning) {
      console.log('⚠️ El servicio de actualización de precios ya está ejecutándose');
      return;
    }

    console.log(`🚀 Iniciando actualización automática de precios cada ${intervalMinutes} minuto(s)`);
    
    this.isRunning = true;
    
    // Ejecutar inmediatamente la primera actualización
    this.updatePrices();
    
    // Configurar el intervalo para futuras actualizaciones
    this.updateInterval = setInterval(() => {
      this.updatePrices();
    }, intervalMinutes * 60 * 1000); // Convertir minutos a milisegundos
  }

  // Detener la actualización automática
  stopAutoUpdate() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
      this.isRunning = false;
      console.log('⏹️ Servicio de actualización de precios detenido');
    }
  }

  // Actualizar precios en la base de datos
  async updatePrices() {
    try {
      console.log(`📊 [${new Date().toISOString()}] Iniciando actualización de precios...`);
      
      // Obtener todas las criptomonedas registradas
      const registeredCryptos = await Cryptocurrency.findAll({
        where: { is_active: true },
        order: [['rank', 'ASC']],
        limit: 100 // Limitar a 100 para evitar problemas con la API
      });

      if (registeredCryptos.length === 0) {
        console.log('⚠️ No hay criptomonedas registradas para actualizar');
        return;
      }

      // Obtener los IDs de CoinMarketCap de las criptomonedas registradas
      // Solo usar las que tienen rank <= 100 para asegurar que están en la API
      const cmcIds = registeredCryptos
        .map(crypto => crypto.rank)
        .filter(rank => rank && rank <= 100);

      if (cmcIds.length === 0) {
        console.log('⚠️ No hay IDs válidos de CoinMarketCap para actualizar');
        return;
      }

      console.log(`📊 Solicitando precios para ${cmcIds.length} criptomonedas con rank <= 100`);

      // Obtener precios actualizados
      const pricesData = await priceService.fetchLatestPrices(cmcIds);
      
      let savedCount = 0;
      let errorCount = 0;
      let skippedCount = 0;

      // Guardar cada precio en la base de datos
      for (const crypto of registeredCryptos) {
        try {
          // Buscar el precio por el ID de CoinMarketCap (que debería ser el rank)
          const priceInfo = pricesData[crypto.rank];
          if (priceInfo && priceInfo.quote?.USD) {
            const priceData = {
              cryptocurrency_id: crypto.id,
              cmc_id: crypto.rank,
              price: priceInfo.quote.USD.price || 0,
              market_cap: priceInfo.quote.USD.market_cap || 0,
              volume_24h: priceInfo.quote.USD.volume_24h || 0,
              percent_change_1h: priceInfo.quote.USD.percent_change_1h || null,
              percent_change_24h: priceInfo.quote.USD.percent_change_24h || null,
              percent_change_7d: priceInfo.quote.USD.percent_change_7d || null,
              percent_change_30d: priceInfo.quote.USD.percent_change_30d || null,
              percent_change_60d: priceInfo.quote.USD.percent_change_60d || null,
              percent_change_90d: priceInfo.quote.USD.percent_change_90d || null,
              market_cap_dominance: priceInfo.quote.USD.market_cap_dominance || null,
              fully_diluted_market_cap: priceInfo.quote.USD.fully_diluted_market_cap || null,
              circulating_supply: priceInfo.circulating_supply || null,
              total_supply: priceInfo.total_supply || null,
              max_supply: priceInfo.max_supply || null,
              cmc_rank: priceInfo.cmc_rank || null,
              volume_change_24h: priceInfo.quote.USD.volume_change_24h || null,
              num_market_pairs: priceInfo.num_market_pairs || null,
              is_active: priceInfo.is_active || null,
              is_fiat: priceInfo.is_fiat || null,
              tvl_ratio: priceInfo.tvl_ratio || null,
              tags: priceInfo.tags || null,
              recorded_at: new Date()
            };

            await CryptocurrencyPrice.create(priceData);
            savedCount++;
          } else {
            skippedCount++;
            console.log(`⚠️ Sin datos de precio para ${crypto.symbol} (Rank: ${crypto.rank})`);
          }
        } catch (error) {
          console.error(`❌ Error al guardar precio para ${crypto.symbol}:`, error.message);
          errorCount++;
        }
      }

      console.log(`✅ [${new Date().toISOString()}] Actualización completada: ${savedCount} precios guardados, ${skippedCount} omitidos, ${errorCount} errores`);

    } catch (error) {
      console.error('❌ Error en la actualización de precios:', error.message);
    }
  }

  // Obtener estado del servicio
  getStatus() {
    return {
      isRunning: this.isRunning,
      lastUpdate: this.lastUpdate || null,
      updateInterval: this.updateInterval ? 'Activo' : 'Inactivo'
    };
  }

  // Limpiar datos históricos antiguos (mantener solo los últimos N días)
  async cleanupOldData(daysToKeep = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      const deletedCount = await CryptocurrencyPrice.destroy({
        where: {
          recorded_at: {
            [require('sequelize').Op.lt]: cutoffDate
          }
        }
      });

      console.log(`🧹 Limpieza completada: ${deletedCount} registros antiguos eliminados`);
      return deletedCount;
    } catch (error) {
      console.error('❌ Error en la limpieza de datos:', error.message);
      throw error;
    }
  }

  // Obtener estadísticas de datos históricos
  async getHistoricalStats() {
    try {
      const totalRecords = await CryptocurrencyPrice.count();
      const oldestRecord = await CryptocurrencyPrice.min('recorded_at');
      const newestRecord = await CryptocurrencyPrice.max('recorded_at');
      const uniqueCryptos = await CryptocurrencyPrice.count({
        distinct: true,
        col: 'cryptocurrency_id'
      });

      return {
        totalRecords,
        oldestRecord,
        newestRecord,
        uniqueCryptos,
        dataRange: oldestRecord && newestRecord ? 
          Math.ceil((new Date(newestRecord) - new Date(oldestRecord)) / (1000 * 60 * 60 * 24)) : 0
      };
    } catch (error) {
      console.error('❌ Error al obtener estadísticas históricas:', error.message);
      throw error;
    }
  }
}

module.exports = new PriceUpdateService(); 