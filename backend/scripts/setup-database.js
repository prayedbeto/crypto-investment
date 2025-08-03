const { sequelize } = require('../src/models');

async function setupDatabase() {
  try {
    console.log('🔄 Conectando a la base de datos...');
    
    // Probar la conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');
    
    // Sincronizar modelos (crear tablas si no existen)
    console.log('🔄 Sincronizando modelos...');
    await sequelize.sync({ force: false });
    console.log('✅ Modelos sincronizados correctamente.');
    
    console.log('🎉 Base de datos configurada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error al configurar la base de datos:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

setupDatabase(); 