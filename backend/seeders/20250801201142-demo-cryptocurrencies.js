'use strict';

const cryptocurrencyService = require('../src/services/cryptocurrencyService');

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      console.log('🌱 Iniciando seeder de criptomonedas...');
      
      // Usar el servicio para obtener y guardar datos de CoinMarketCap
      const result = await cryptocurrencyService.fetchAndSaveAllData();
      
      console.log('✅ Seeder completado exitosamente!');
      console.log('📊 Resultados:', result);
      
    } catch (error) {
      console.error('❌ Error en el seeder:', error);
      throw error;
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      console.log('🗑️ Limpiando datos de criptomonedas...');
      
      // Eliminar todos los datos de metadatos y criptomonedas
      await queryInterface.bulkDelete('cryptocurrency_metadata', null, {});
      await queryInterface.bulkDelete('cryptocurrencies', null, {});
      
      console.log('✅ Datos eliminados exitosamente!');
      
    } catch (error) {
      console.error('❌ Error al limpiar datos:', error);
      throw error;
    }
  }
};
