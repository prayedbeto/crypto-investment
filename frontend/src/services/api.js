import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Servicio de salud de la API
export const healthService = {
  check: () => api.get('/health'),
};

// Servicio de criptomonedas
export const cryptocurrencyService = {
  getAll: () => api.get('/cryptocurrencies'),
  getById: (id) => api.get(`/cryptocurrencies/${id}`),
};

// Servicio de precios históricos
export const historicalPriceService = {
  getPrices: (ids) => {
    if (!ids || ids.trim() === '') {
      return Promise.reject(new Error('IDs de criptomonedas requeridos'));
    }
    return api.get(`/historical/prices?ids=${ids}`);
  },
};

// Servicio de estadísticas del mercado
export const marketStatsService = {
  getMarketStats: () => api.get('/prices/market-stats'),
};

export default api; 