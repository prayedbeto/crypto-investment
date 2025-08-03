const { Cryptocurrency, CryptocurrencyPrice } = require('../src/models');
const priceService = require('../src/services/priceService');

async function debugPrices() {
  try {
    console.log('🔍 Iniciando diagnóstico de precios...\n');

    // 1. Verificar criptomonedas registradas
    console.log('1️⃣ Verificando criptomonedas registradas...');
    const registeredCryptos = await Cryptocurrency.findAll({
      where: { is_active: true },
      order: [['rank', 'ASC']],
      limit: 20 // Solo las primeras 20 para el diagnóstico
    });

    console.log(`📊 Total de criptomonedas activas: ${registeredCryptos.length}`);
    console.log('📋 Primeras 10 criptomonedas:');
    registeredCryptos.slice(0, 10).forEach(crypto => {
      console.log(`   ID: ${crypto.id}, Rank: ${crypto.rank}, Symbol: ${crypto.symbol}, Name: ${crypto.name}`);
    });

    // 2. Verificar qué IDs de CoinMarketCap estamos usando
    console.log('\n2️⃣ Verificando IDs de CoinMarketCap...');
    const cmcIds = registeredCryptos
      .map(crypto => crypto.rank)
      .filter(rank => rank && rank <= 100);

    console.log(`📊 IDs de CoinMarketCap válidos: ${cmcIds.length}`);
    console.log('📋 IDs que se usarán:', cmcIds.slice(0, 10));

    // 3. Obtener datos de precios de CoinMarketCap
    console.log('\n3️⃣ Obteniendo datos de CoinMarketCap...');
    const pricesData = await priceService.fetchLatestPrices(cmcIds);
    
    console.log(`📊 Datos recibidos de CoinMarketCap: ${Object.keys(pricesData).length}`);
    console.log('📋 IDs disponibles en la respuesta:', Object.keys(pricesData).slice(0, 10));

    // 4. Verificar qué datos se están guardando
    console.log('\n4️⃣ Verificando datos que se guardarían...');
    let wouldSaveCount = 0;
    let missingDataCount = 0;

    for (const crypto of registeredCryptos) {
      const priceInfo = pricesData[crypto.rank];
      if (priceInfo && priceInfo.quote?.USD) {
        wouldSaveCount++;
        console.log(`   ✅ ${crypto.symbol} (ID: ${crypto.id}, Rank: ${crypto.rank}) - Precio: $${priceInfo.quote.USD.price}`);
      } else {
        missingDataCount++;
        console.log(`   ❌ ${crypto.symbol} (ID: ${crypto.id}, Rank: ${crypto.rank}) - Sin datos de precio`);
      }
    }

    console.log(`\n📊 Resumen:`);
    console.log(`   - Criptomonedas que se guardarían: ${wouldSaveCount}`);
    console.log(`   - Criptomonedas sin datos: ${missingDataCount}`);

    // 5. Verificar datos históricos existentes
    console.log('\n5️⃣ Verificando datos históricos existentes...');
    const historicalStats = await CryptocurrencyPrice.findAll({
      attributes: [
        'cryptocurrency_id',
        [require('sequelize').fn('COUNT', require('sequelize').col('id')), 'count']
      ],
      group: ['cryptocurrency_id'],
      order: [[require('sequelize').fn('COUNT', require('sequelize').col('id')), 'DESC']],
      limit: 10
    });

    console.log('📋 Top 10 criptomonedas con más datos históricos:');
    for (const stat of historicalStats) {
      const crypto = registeredCryptos.find(c => c.id === stat.cryptocurrency_id);
      console.log(`   ${crypto?.symbol || 'Unknown'} (ID: ${stat.cryptocurrency_id}) - ${stat.dataValues.count} registros`);
    }

    // 6. Verificar si hay problemas con el mapeo de IDs
    console.log('\n6️⃣ Verificando mapeo de IDs...');
    const cryptoWithPrices = registeredCryptos.filter(crypto => {
      return pricesData[crypto.rank] && pricesData[crypto.rank].quote?.USD;
    });

    console.log('📋 Criptomonedas que SÍ tienen datos de precio:');
    cryptoWithPrices.forEach(crypto => {
      console.log(`   ${crypto.symbol} - ID interno: ${crypto.id}, Rank: ${crypto.rank}`);
    });

    console.log('\n📋 Criptomonedas que NO tienen datos de precio:');
    const cryptoWithoutPrices = registeredCryptos.filter(crypto => {
      return !pricesData[crypto.rank] || !pricesData[crypto.rank].quote?.USD;
    });
    
    cryptoWithoutPrices.forEach(crypto => {
      console.log(`   ${crypto.symbol} - ID interno: ${crypto.id}, Rank: ${crypto.rank}`);
    });

  } catch (error) {
    console.error('❌ Error en el diagnóstico:', error);
  }
}

// Ejecutar diagnóstico
debugPrices(); 