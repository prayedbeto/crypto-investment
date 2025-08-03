import { useState, useEffect } from 'react';
import { marketStatsService } from '../services/api';
import { formatNumber } from '../utils/cryptoUtils';

export default function MarketStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMarketStats();
  }, []);

  const loadMarketStats = async () => {
    try {
      setLoading(true);
      const response = await marketStatsService.getMarketStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error loading market stats:', error);
      setError('Error al cargar las estadísticas del mercado');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Estadísticas del Mercado
        </h3>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600">Cargando estadísticas...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Estadísticas del Mercado
        </h3>
        <div className="text-center py-8 text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Estadísticas del Mercado
        </h3>
        <div className="text-center py-8 text-gray-500">
          <p>No hay estadísticas disponibles</p>
        </div>
      </div>
    );
  }

  const { 
    total_cryptocurrencies, 
    total_market_cap, 
    total_volume_24h, 
    market_sentiment, 
    average_change_24h 
  } = stats;

  const isPositiveChange = average_change_24h >= 0;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Estadísticas del Mercado
        </h3>
        <button 
          onClick={loadMarketStats}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Actualizar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de Criptomonedas */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">₿</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total Criptomonedas</p>
              <p className="text-xl font-semibold text-gray-900">{total_cryptocurrencies}</p>
            </div>
          </div>
        </div>

        {/* Capitalización Total del Mercado */}
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">$</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Market Cap Total</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatNumber(total_market_cap)}
              </p>
            </div>
          </div>
        </div>

        {/* Volumen 24h */}
        <div className="bg-purple-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">↻</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">Volumen 24h</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatNumber(total_volume_24h)}
              </p>
            </div>
          </div>
        </div>

        {/* Cambio Promedio 24h */}
        <div className={`p-4 rounded-lg ${isPositiveChange ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                isPositiveChange ? 'bg-green-500' : 'bg-red-500'
              }`}>
                <span className="text-white font-bold text-sm">
                  {isPositiveChange ? '↗' : '↘'}
                </span>
              </div>
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${
                isPositiveChange ? 'text-green-600' : 'text-red-600'
              }`}>
                Cambio Promedio 24h
              </p>
              <p className={`text-xl font-semibold ${
                isPositiveChange ? 'text-green-700' : 'text-red-700'
              }`}>
                {isPositiveChange ? '+' : ''}{average_change_24h.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sentimiento del Mercado */}
      <div className="mt-6">
        <h4 className="text-md font-medium text-gray-900 mb-3">Sentimiento del Mercado</h4>
        <div className="grid grid-cols-3 gap-4">
          {/* Ganadores */}
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{market_sentiment.gainers}</div>
            <div className="text-sm text-green-700 font-medium">Ganadores</div>
          </div>

          {/* Perdedores */}
          <div className="bg-red-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">{market_sentiment.losers}</div>
            <div className="text-sm text-red-700 font-medium">Perdedores</div>
          </div>

          {/* Sin Cambios */}
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-600">{market_sentiment.unchanged}</div>
            <div className="text-sm text-gray-700 font-medium">Sin Cambios</div>
          </div>
        </div>
      </div>

      {/* Resumen del Sentimiento */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Estado del Mercado:</span>
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
            market_sentiment.gainers > market_sentiment.losers 
              ? 'bg-green-100 text-green-800' 
              : market_sentiment.losers > market_sentiment.gainers
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {market_sentiment.gainers > market_sentiment.losers 
              ? '🟢 Alcista' 
              : market_sentiment.losers > market_sentiment.gainers
              ? '🔴 Bajista'
              : '⚪ Neutral'
            }
          </span>
        </div>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-center">
        Última actualización: {new Date().toLocaleTimeString('es-ES')}
      </div>
    </div>
  );
} 