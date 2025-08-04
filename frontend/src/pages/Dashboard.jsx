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
import CryptoSelector from '../components/CryptoSelector';
import CryptoPriceTable from '../components/CryptoPriceTable';

export default function Dashboard() {
  const [cryptocurrencies, setCryptocurrencies] = useState([]);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [selectedCryptos, setSelectedCryptos] = useState([]);
  const [chartPricesData, setChartPricesData] = useState({});
  const [backendSyncStatus, setBackendSyncStatus] = useState('idle'); // 'idle', 'syncing', 'success', 'error'

  useEffect(() => {
    const loadCryptocurrencies = async () => {
      try {
        setLoading(true);
        const response = await cryptocurrencyService.getAll();
        const cryptoData = response.data.data;
        setCryptocurrencies(cryptoData);

        // Usar los IDs específicos que sabemos que tienen datos de precios
        const defaultCryptoIds = [1, 18, 88, 23, 66, 52];
        const defaultCryptos = cryptoData.filter(crypto => defaultCryptoIds.includes(crypto.id));
        setSelectedCryptos(defaultCryptos);

        const cryptoIds = defaultCryptoIds.join(',');
        
        if (cryptoIds) {
          const pricesResponse = await historicalPriceService.getPrices(cryptoIds);
          setPrices(pricesResponse.data.data);
          setChartPricesData(pricesResponse.data.data);
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

  // Función para manejar cambios en las criptomonedas seleccionadas
  const handleCryptoSelectionChange = (newSelection) => {
    setSelectedCryptos(newSelection);
  };

  // Función para manejar los datos de precios del gráfico
  const handleChartPricesDataChange = (pricesData) => {
    setChartPricesData(pricesData);
  };

  // Función para restaurar las criptomonedas por defecto
  const handleRestoreDefaults = () => {
    const defaultCryptos = cryptocurrencies.slice(0, 6);
    setSelectedCryptos(defaultCryptos);
  };

  // Función para manejar el cambio de actualización automática
  const handleAutoUpdateChange = async (newAutoUpdateState) => {
    setAutoUpdate(newAutoUpdateState);
    setBackendSyncStatus('syncing');
    
    try {
      if (newAutoUpdateState) {
        await historicalPriceService.startUpdate();
        setBackendSyncStatus('success');
        console.log('✅ Actualización automática iniciada en el backend');
      } else {
        await historicalPriceService.stopUpdate();
        setBackendSyncStatus('success');
        console.log('⏸️ Actualización automática detenida en el backend');
      }
    } catch (error) {
      setBackendSyncStatus('error');
      console.error('❌ Error al sincronizar con el backend:', error);
    }
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

        {/* Crypto Selector */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Selección de Criptomonedas
            </h2>
            <button
              onClick={handleRestoreDefaults}
              className="px-4 py-2 bg-blue-100 text-blue-800 rounded-md text-sm font-medium hover:bg-blue-200"
            >
              🔄 Restaurar por Defecto
            </button>
          </div>
          <div className="card">
            <CryptoSelector 
              selectedCryptos={selectedCryptos}
              onSelectionChange={handleCryptoSelectionChange}
            />
          </div>
        </div>

        {/* Price Chart */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Gráfica de Precios
            </h2>
            <button
              onClick={() => handleAutoUpdateChange(!autoUpdate)}
              disabled={backendSyncStatus === 'syncing'}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                backendSyncStatus === 'syncing'
                  ? 'bg-yellow-100 text-yellow-800 cursor-not-allowed'
                  : autoUpdate
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {backendSyncStatus === 'syncing' ? (
                <>
                  <span className="animate-spin inline-block w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full mr-2"></span>
                  Sincronizando...
                </>
              ) : autoUpdate ? (
                <>
                  {backendSyncStatus === 'success' ? '✅' : '🔄'} Actualización Automática ON
                </>
              ) : (
                <>
                  {backendSyncStatus === 'error' ? '❌' : '⏸️'} Actualización Automática OFF
                </>
              )}
            </button>
          </div>
          <PriceChart 
            autoUpdate={autoUpdate} 
            selectedCryptos={selectedCryptos}
            onPricesDataChange={handleChartPricesDataChange}
          />
          
          {/* Estado de sincronización con el backend */}
          {backendSyncStatus !== 'idle' && (
            <div className="mt-2 text-xs text-center">
              {backendSyncStatus === 'syncing' && (
                <span className="text-yellow-600">
                  🔄 Sincronizando con el servidor...
                </span>
              )}
              {backendSyncStatus === 'success' && (
                <span className="text-green-600">
                  ✅ Sincronizado con el servidor
                </span>
              )}
              {backendSyncStatus === 'error' && (
                <span className="text-red-600">
                  ❌ Error de sincronización con el servidor
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price Table */}
        <div className="mt-8">
          <CryptoPriceTable 
            selectedCryptos={selectedCryptos}
            pricesData={chartPricesData}
          />
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