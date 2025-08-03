const cryptocurrencyService = require('../src/services/cryptocurrencyService');

async function testAPI() {
  try {
    console.log('🧪 Iniciando pruebas de la API...\n');

    // Probar obtención de lista de criptomonedas
    console.log('1️⃣ Probando obtención de lista de criptomonedas...');
    const cryptocurrencies = await cryptocurrencyService.fetchCryptocurrenciesList();
    console.log(`✅ Se obtuvieron ${cryptocurrencies.length} criptomonedas`);
    console.log(`📝 Primera criptomoneda: ${cryptocurrencies[0].name} (${cryptocurrencies[0].symbol})\n`);

    // Probar obtención de metadatos
    console.log('2️⃣ Probando obtención de metadatos...');
    const idsForMetadata = cryptocurrencies.slice(0, 3).map(crypto => crypto.id).join(',');
    const metadata = await cryptocurrencyService.fetchCryptocurrencyMetadata(idsForMetadata);
    console.log(`✅ Se obtuvieron metadatos para ${Object.keys(metadata).length} criptomonedas`);
    
    // Mostrar ejemplo de metadatos
    const firstMetadata = Object.values(metadata)[0];
    console.log(`📝 Ejemplo de metadatos para ${firstMetadata.name}:`);
    console.log(`   - Descripción: ${firstMetadata.description?.substring(0, 100)}...`);
    console.log(`   - Categoría: ${firstMetadata.category}`);
    console.log(`   - Tags: ${firstMetadata.tags?.slice(0, 3).join(', ')}`);
    console.log(`   - Website: ${firstMetadata.urls?.website?.[0] || 'N/A'}\n`);

    console.log('🎉 Todas las pruebas pasaron exitosamente!');
    
  } catch (error) {
    console.error('❌ Error en las pruebas:', error.message);
    if (error.response?.data) {
      console.error('📋 Detalles del error:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Ejecutar pruebas
testAPI(); 