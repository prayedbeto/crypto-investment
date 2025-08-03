const express = require('express');
const cors = require('cors');
require('dotenv').config();

const healthRoutes = require('./routes/health');
const cryptocurrencyRoutes = require('./routes/cryptocurrencies');
const priceRoutes = require('./routes/prices');
const historicalRoutes = require('./routes/historical');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/health', healthRoutes);
app.use('/api/cryptocurrencies', cryptocurrencyRoutes);
app.use('/api/prices', priceRoutes);
app.use('/api/historical', historicalRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    message: 'Crypto Investment API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      cryptocurrencies: '/api/cryptocurrencies',
      prices: '/api/prices',
      historical: '/api/historical'
    }
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Algo salió mal!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Ruta 404
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

const PORT = process.env.PORT || 3001;

// Iniciar el servicio de actualización automática de precios
const priceUpdateService = require('./services/priceUpdateService');

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`Ambiente: ${process.env.NODE_ENV}`);
  
  // Iniciar actualización automática de precios cada minuto
  if (process.env.AUTO_UPDATE_PRICES === 'true') {
    console.log('🔄 Iniciando servicio de actualización automática de precios...');
    priceUpdateService.startAutoUpdate(1); // Cada minuto
  }
});

module.exports = app;