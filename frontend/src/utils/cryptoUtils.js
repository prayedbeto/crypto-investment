/**
 * Utilidades para manejo de datos de criptomonedas
 */

/**
 * Formatea un número grande con sufijos (K, M, B)
 * @param {string|number} num - Número a formatear
 * @param {boolean} includeSymbol - Si incluir el símbolo de moneda
 * @returns {string} Número formateado
 */
export const formatNumber = (num, includeSymbol = true) => {
  if (!num) return includeSymbol ? '$0.00' : '0.00';
  
  const number = parseFloat(num);
  const symbol = includeSymbol ? '$' : '';
  
  if (number >= 1e12) {
    return `${symbol}${(number / 1e12).toFixed(2)}T`;
  } else if (number >= 1e9) {
    return `${symbol}${(number / 1e9).toFixed(2)}B`;
  } else if (number >= 1e6) {
    return `${symbol}${(number / 1e6).toFixed(2)}M`;
  } else if (number >= 1e3) {
    return `${symbol}${(number / 1e3).toFixed(2)}K`;
  }
  return `${symbol}${number.toFixed(2)}`;
};

/**
 * Formatea un precio de criptomoneda
 * @param {string|number} price - Precio a formatear
 * @returns {string} Precio formateado
 */
export const formatPrice = (price) => {
  if (!price) return '$0.00';
  
  const number = parseFloat(price);
  
  // Para precios muy altos (como Bitcoin), mostrar con comas
  if (number >= 1000) {
    return `$${number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  
  return `$${number.toFixed(2)}`;
};

/**
 * Calcula el cambio porcentual entre dos precios
 * @param {string|number} currentPrice - Precio actual
 * @param {string|number} previousPrice - Precio anterior
 * @returns {string} Cambio porcentual formateado
 */
export const calculatePriceChange = (currentPrice, previousPrice) => {
  if (!currentPrice || !previousPrice) return '0.00';
  
  const current = parseFloat(currentPrice);
  const previous = parseFloat(previousPrice);
  
  if (previous === 0) return '0.00';
  
  const change = ((current - previous) / previous) * 100;
  return change.toFixed(2);
};

/**
 * Obtiene el color de fondo para el símbolo de una criptomoneda
 * @param {string} symbol - Símbolo de la criptomoneda
 * @returns {string} Clase CSS del color
 */
export const getCryptoColor = (symbol) => {
  const colors = {
    'BTC': 'bg-crypto-bitcoin',
    'ETH': 'bg-crypto-ethereum',
    'BNB': 'bg-crypto-binance',
    'ADA': 'bg-crypto-cardano',
    'SOL': 'bg-crypto-solana',
    'DOT': 'bg-crypto-polkadot',
    'XRP': 'bg-black',
    'MATIC': 'bg-purple-600',
    'LINK': 'bg-blue-600',
    'UNI': 'bg-pink-600',
    'AVAX': 'bg-red-600',
    'ATOM': 'bg-blue-500',
    'LTC': 'bg-gray-500',
    'BCH': 'bg-green-600',
    'XLM': 'bg-purple-500',
    'ALGO': 'bg-gray-400',
    'VET': 'bg-teal-600',
    'ICP': 'bg-orange-500',
    'FIL': 'bg-blue-400',
    'TRX': 'bg-red-500'
  };
  
  return colors[symbol] || 'bg-gray-500';
};

/**
 * Obtiene el símbolo Unicode para mostrar en el ícono
 * @param {string} symbol - Símbolo de la criptomoneda
 * @returns {string} Símbolo Unicode
 */
export const getCryptoSymbol = (symbol) => {
  const symbols = {
    'BTC': '₿',
    'ETH': 'Ξ',
    'BNB': 'B',
    'ADA': 'A',
    'SOL': 'S',
    'DOT': 'D',
    'XRP': 'X',
    'MATIC': 'M',
    'LINK': 'L',
    'UNI': 'U',
    'AVAX': 'A',
    'ATOM': 'A',
    'LTC': 'Ł',
    'BCH': 'B',
    'XLM': 'X',
    'ALGO': 'A',
    'VET': 'V',
    'ICP': 'I',
    'FIL': 'F',
    'TRX': 'T'
  };
  
  return symbols[symbol] || symbol.charAt(0);
};

/**
 * Obtiene el precio más reciente de una criptomoneda
 * @param {Object} cryptoData - Datos de la criptomoneda con precios
 * @returns {Object|null} Precio más reciente o null si no hay datos
 */
export const getLatestPrice = (cryptoData) => {
  if (cryptoData && cryptoData.prices && cryptoData.prices.length > 0) {
    return cryptoData.prices[cryptoData.prices.length - 1];
  }
  return null;
};

/**
 * Calcula el cambio de precio en las últimas 24 horas
 * @param {Object} cryptoData - Datos de la criptomoneda con precios
 * @returns {string} Cambio porcentual formateado
 */
export const getPriceChange24h = (cryptoData) => {
  if (cryptoData && cryptoData.prices && cryptoData.prices.length >= 2) {
    const latestPrice = cryptoData.prices[cryptoData.prices.length - 1].price;
    const previousPrice = cryptoData.prices[cryptoData.prices.length - 2].price;
    return calculatePriceChange(latestPrice, previousPrice);
  }
  return '0.00';
}; 