const axios = require('axios');
const { Cryptocurrency, CryptocurrencyMetadata } = require('../models');

class CryptocurrencyService {
  constructor() {
    this.apiUrl = process.env.COINMARKETCAP_API_URL;
    this.apiKey = process.env.COINMARKETCAP_API_KEY;
  }

  // Obtener lista de criptomonedas de CoinMarketCap
  async fetchCryptocurrenciesList() {
    try {
      const response = await axios.get(`${this.apiUrl}/v1/cryptocurrency/map?start=1&limit=100&sort=id`, {
        headers: {
          'X-CMC_PRO_API_KEY': this.apiKey
        }
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener lista de criptomonedas:', error.response?.data || error.message);
      throw new Error('Error al obtener datos de CoinMarketCap');
    }
  }

  // Obtener metadatos de criptomonedas
  async fetchCryptocurrencyMetadata(ids) {
    try {
      const response = await axios.get(`${this.apiUrl}/v2/cryptocurrency/info?id=${ids}`, {
        headers: {
          'X-CMC_PRO_API_KEY': this.apiKey
        }
      });
      
      return response.data.data;
    } catch (error) {
      console.error('Error al obtener metadatos de criptomonedas:', error.response?.data || error.message);
      throw new Error('Error al obtener metadatos de CoinMarketCap');
    }
  }

  // Guardar criptomonedas en la base de datos
  async saveCryptocurrencies(cryptocurrencies) {
    let savedCount = 0;
    let updatedCount = 0;

    for (const crypto of cryptocurrencies) {
      const cryptoData = {
        rank: crypto.rank || 0,
        name: crypto.name,
        symbol: crypto.symbol,
        slug: crypto.slug,
        is_active: true,
        status: 1,
        first_historical_data: crypto.first_historical_data ? new Date(crypto.first_historical_data) : null,
        last_historical_data: new Date(),
        platform: crypto.platform?.name || null
      };

      // Buscar si ya existe la criptomoneda por ID de CoinMarketCap
      const existingCrypto = await Cryptocurrency.findOne({
        where: { slug: cryptoData.slug }
      });

      if (existingCrypto) {
        // Actualizar datos existentes
        await existingCrypto.update(cryptoData);
        updatedCount++;
      } else {
        // Crear nueva criptomoneda
        await Cryptocurrency.create(cryptoData);
        savedCount++;
      }
    }

    return { saved: savedCount, updated: updatedCount, total: savedCount + updatedCount };
  }

  // Guardar metadatos de criptomonedas
  async saveCryptocurrencyMetadata(metadata) {
    let savedCount = 0;
    let updatedCount = 0;

    for (const [id, cryptoMetadata] of Object.entries(metadata)) {
      // Buscar la criptomoneda por el ID de CoinMarketCap
      const cryptocurrency = await Cryptocurrency.findOne({
        where: { slug: cryptoMetadata.slug }
      });

      if (!cryptocurrency) {
        console.log(`⚠️ Criptomoneda no encontrada para metadata ID ${id}: ${cryptoMetadata.name}`);
        continue;
      }

      const metadataData = {
        cryptocurrency_id: cryptocurrency.id, // Usar el ID interno de nuestra base de datos
        logo: cryptoMetadata.logo || null,
        description: cryptoMetadata.description || null,
        date_added: cryptoMetadata.date_added ? new Date(cryptoMetadata.date_added) : null,
        date_launched: cryptoMetadata.date_launched ? new Date(cryptoMetadata.date_launched) : null,
        tags: JSON.stringify(cryptoMetadata.tags || []),
        category: cryptoMetadata.category || null,
        platform: cryptoMetadata.platform ? JSON.stringify(cryptoMetadata.platform) : null,
        website_urls: JSON.stringify(cryptoMetadata.urls?.website || []),
        technical_doc_urls: JSON.stringify(cryptoMetadata.urls?.technical_doc || []),
        twitter_urls: JSON.stringify(cryptoMetadata.urls?.twitter || []),
        reddit_urls: JSON.stringify(cryptoMetadata.urls?.reddit || []),
        message_board_urls: JSON.stringify(cryptoMetadata.urls?.message_board || []),
        announcement_urls: JSON.stringify(cryptoMetadata.urls?.announcement || []),
        chat_urls: JSON.stringify(cryptoMetadata.urls?.chat || []),
        explorer_urls: JSON.stringify(cryptoMetadata.urls?.explorer || []),
        source_code_urls: JSON.stringify(cryptoMetadata.urls?.source_code || []),
        facebook_urls: JSON.stringify(cryptoMetadata.urls?.facebook || []),
        subreddit: cryptoMetadata.subreddit || null,
        twitter_username: cryptoMetadata.twitter_username || null,
        is_hidden: cryptoMetadata.is_hidden === 1 || cryptoMetadata.is_hidden === true,
        notice: cryptoMetadata.notice || null,
        tag_names: JSON.stringify(cryptoMetadata['tag-names'] || []),
        tag_groups: JSON.stringify(cryptoMetadata['tag-groups'] || []),
        contract_addresses: JSON.stringify(cryptoMetadata.contract_address || []),
        self_reported_circulating_supply: cryptoMetadata.self_reported_circulating_supply || null,
        self_reported_market_cap: cryptoMetadata.self_reported_market_cap || null,
        self_reported_tags: cryptoMetadata.self_reported_tags ? JSON.stringify(cryptoMetadata.self_reported_tags) : null,
        infinite_supply: cryptoMetadata.infinite_supply || false
      };

      // Buscar si ya existe el metadata
      const existingMetadata = await CryptocurrencyMetadata.findOne({
        where: { cryptocurrency_id: metadataData.cryptocurrency_id }
      });

      if (existingMetadata) {
        // Actualizar metadata existente
        await existingMetadata.update(metadataData);
        updatedCount++;
      } else {
        // Crear nuevo metadata
        await CryptocurrencyMetadata.create(metadataData);
        savedCount++;
      }
    }

    return { saved: savedCount, updated: updatedCount, total: savedCount + updatedCount };
  }

  // Obtener y guardar tanto criptomonedas como metadatos
  async fetchAndSaveAllData() {
    try {
      console.log('🔄 Obteniendo lista de criptomonedas...');
      const cryptocurrencies = await this.fetchCryptocurrenciesList();
      
      console.log('💾 Guardando criptomonedas en la base de datos...');
      const cryptoResult = await this.saveCryptocurrencies(cryptocurrencies);
      
      console.log('🔄 Obteniendo metadatos de criptomonedas...');
      // Obtener IDs de las primeras 10 criptomonedas para los metadatos
      const idsForMetadata = cryptocurrencies.slice(0, 10).map(crypto => crypto.id).join(',');
      const metadata = await this.fetchCryptocurrencyMetadata(idsForMetadata);
      
      console.log('💾 Guardando metadatos en la base de datos...');
      const metadataResult = await this.saveCryptocurrencyMetadata(metadata);

      return {
        cryptocurrencies: cryptoResult,
        metadata: metadataResult,
        message: 'Datos de criptomonedas y metadatos actualizados exitosamente'
      };
    } catch (error) {
      console.error('Error en fetchAndSaveAllData:', error);
      throw error;
    }
  }
}

module.exports = new CryptocurrencyService(); 