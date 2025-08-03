/**
 * Tipos para las criptomonedas
 */

/**
 * Estructura de una criptomoneda individual
 */
export const Cryptocurrency = {
  id: Number,
  rank: Number,
  name: String,
  symbol: String,
  slug: String,
  is_active: Boolean,
  status: Number,
  first_historical_data: String,
  last_historical_data: String,
  platform: String | null,
  createdAt: String,
  updatedAt: String
};

/**
 * Respuesta de la API de criptomonedas
 */
export const CryptocurrenciesResponse = {
  success: Boolean,
  data: [Cryptocurrency],
  count: Number
};

/**
 * Estructura de un precio histórico
 */
export const HistoricalPrice = {
  price: String,
  market_cap: String,
  volume_24h: String,
  recorded_at: String
};

/**
 * Estructura de datos de criptomoneda con precios
 */
export const CryptocurrencyWithPrices = {
  cryptocurrency: {
    id: Number,
    name: String,
    symbol: String
  },
  prices: [HistoricalPrice]
};

/**
 * Respuesta de la API de precios históricos
 */
export const HistoricalPricesResponse = {
  success: Boolean,
  data: Object, // { [cryptocurrencyId]: CryptocurrencyWithPrices }
  count: Number,
  period: String
}; 