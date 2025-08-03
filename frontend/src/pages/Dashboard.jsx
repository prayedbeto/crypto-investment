import { useState, useEffect } from 'react';
import { healthService, cryptocurrencyService, historicalPriceService } from '../services/api';
import { 
  formatNumber, 
  formatPrice, 
  getCryptoColor, 
  getCryptoSymbol, 
  getLatestPrice, 
  getPriceChange24h 
} from '../utils/cryptoUtils';
import ApiHealth from '../components/ApiHealth';
import PriceChart from '../components/PriceChart';
import MarketStats from '../components/MarketStats';

export default function Dashboard() {
  const [cryptocurrencies, setCryptocurrencies] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoUpdate, setAutoUpdate] = useState(false);

  useEffect(() => {

    const loadCryptocurrencies = async () => {
      try {
        setLoading(true);
        const response = await cryptocurrencyService.getAll();
        const cryptoData = response.data.data;
        setCryptocurrencies(cryptoData);

        // Obtener los IDs de las primeras 6 criptomonedas para consultar precios
        const cryptoIds = cryptoData.slice(0, 6).map(crypto => crypto.id).join(',');
        
        if (cryptoIds) {
          const pricesResponse = await historicalPriceService.getPrices(cryptoIds);
          setPrices(pricesResponse.data.data);
        }
      } catch (error) {
        console.error('Error loading cryptocurrencies:', error);
        setError('Error al cargar los datos de criptomonedas');
      } finally {
        setLoading(false);
      }
    };

    loadCryptocurrencies();
  }, []);

  // Función para obtener el precio más reciente de una criptomoneda
  const getCryptoLatestPrice = (cryptoId) => {
    const cryptoData = prices[cryptoId];
    return getLatestPrice(cryptoData);
  };

  // Función para calcular el cambio porcentual en 24h
  const getCryptoPriceChange = (cryptoId) => {
    const cryptoData = prices[cryptoId];
    return getPriceChange24h(cryptoData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Bienvenido a CryptoInvestment!
          </p>
        </div>

        {/* Market Stats */}
        <div className="mb-8">
          <MarketStats />
        </div>

        {/* Price Chart */}
        <div className="mt-8">
          {loading ? (
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Variación de Precios
              </h3>
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                <span className="ml-2 text-gray-600">Cargando datos de criptomonedas...</span>
              </div>
            </div>
          ) : cryptocurrencies.length > 0 ? (
            <PriceChart 
              autoUpdate={autoUpdate} 
              cryptoIds={cryptocurrencies.slice(0, 6).map(crypto => crypto.id).join(',')}
            />
          ) : (
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Variación de Precios
              </h3>
              <div className="text-center py-8 text-gray-500">
                <p>No hay criptomonedas disponibles</p>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          <ApiHealth />

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Acciones Rápidas
            </h3>
            <div className="space-y-3">
              <button className="w-full btn btn-primary" onClick={() => {
                setAutoUpdate(!autoUpdate);
              }}>
                {autoUpdate ? 'Desactivar actualización en tiempo real' : 'Activar actualización en tiempo real'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
} 