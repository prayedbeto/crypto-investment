import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { historicalPriceService } from '../services/api';
import { formatPrice, getCryptoChartColor } from '../utils/cryptoUtils';

export default function PriceChart({ autoUpdate = false, selectedCryptos = [], onPricesDataChange }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pricesData, setPricesData] = useState({});

  // Convertir las criptomonedas seleccionadas a IDs
  const cryptoIds = selectedCryptos.map(crypto => crypto.id).join(',');

  useEffect(() => {
    if (selectedCryptos.length > 0) {
      loadChartData();
    } else {
      setChartData([]);
      setPricesData({});
      setLoading(false);
      setError(null);
    }
  }, [selectedCryptos]);

  useEffect(() => {
    let interval;
    
    // Configurar intervalo local para actualizar datos del gráfico
    if (autoUpdate) {
      interval = setInterval(() => {
        loadChartData();
      }, 60000); // Actualizar cada 60 segundos
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [autoUpdate]);

  const loadChartData = async () => {
    try {
      setLoading(true);
      
      // Validar que tengamos criptomonedas seleccionadas
      if (selectedCryptos.length === 0) {
        setError('No hay criptomonedas seleccionadas');
        setLoading(false);
        return;
      }

      const response = await historicalPriceService.getPrices(cryptoIds);
      const responseData = response.data.data;
      
      // Guardar los datos de precios para pasarlos al componente padre
      setPricesData(responseData);
      
      // Notificar al componente padre sobre los datos de precios
      if (onPricesDataChange) {
        onPricesDataChange(responseData);
      }
      
      // Procesar los datos para el formato requerido por Recharts
      const processedData = processChartData(responseData);
      setChartData(processedData);
    } catch (error) {
      console.error('Error loading chart data:', error);
      setError('Error al cargar los datos de la gráfica');
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (pricesData) => {
    const chartData = [];
    
    // Crear un mapeo de ID a símbolo usando selectedCryptos
    const cryptoMap = {};
    selectedCryptos.forEach(crypto => {
      cryptoMap[crypto.id] = crypto.symbol;
    });

    // Obtener todos los timestamps únicos
    const allTimestamps = new Set();
    Object.values(pricesData).forEach(cryptoData => {
      if (cryptoData.prices && Array.isArray(cryptoData.prices)) {
        cryptoData.prices.forEach(price => {
          allTimestamps.add(price.recorded_at);
        });
      }
    });

    // Convertir timestamps a objetos de fecha ordenados
    const sortedTimestamps = Array.from(allTimestamps)
      .map(timestamp => new Date(timestamp))
      .sort((a, b) => a - b);

    // Crear un punto de datos para cada timestamp
    sortedTimestamps.forEach(timestamp => {
      const dataPoint = {
        timestamp: timestamp.toISOString(),
        time: timestamp.toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        date: timestamp.toLocaleDateString('es-ES', { 
          day: '2-digit', 
          month: '2-digit' 
        })
      };

      // Agregar precio para cada criptomoneda seleccionada en este timestamp
      selectedCryptos.forEach(crypto => {
        const cryptoData = pricesData[crypto.id];
        if (cryptoData && cryptoData.prices && Array.isArray(cryptoData.prices)) {
          // Buscar el precio más cercano a este timestamp
          const priceEntry = cryptoData.prices.find(price => 
            new Date(price.recorded_at).getTime() === timestamp.getTime()
          );
          
          if (priceEntry) {
            dataPoint[crypto.symbol] = parseFloat(priceEntry.price);
          }
        }
      });

      chartData.push(dataPoint);
    });

    return chartData;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Fecha:</strong> {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              <strong>{entry.name}:</strong> {formatPrice(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => {
    return (
      <div className="flex flex-wrap gap-4 justify-center mt-4">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: entry.color }}
            ></div>
            <span className="text-sm font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Variación de Precios
        </h3>
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2 text-gray-600">Cargando gráfica...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Variación de Precios
        </h3>
        <div className="text-center py-8 text-red-600">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (selectedCryptos.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Variación de Precios
        </h3>
        <div className="text-center py-8 text-gray-500">
          <p>Selecciona criptomonedas para ver la gráfica</p>
        </div>
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Variación de Precios
        </h3>
        <div className="text-center py-8 text-gray-500">
          <p>No hay datos disponibles para mostrar</p>
        </div>
      </div>
    );
  }

  const colors = {
    'BTC': '#f7931a',
    'ETH': '#627eea',
    'BNB': '#f3ba2f',
    'ADA': '#0033ad',
    'SOL': '#14f195',
    'DOT': '#e6007a'
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          Variación de Precios
        </h3>
        <button 
          onClick={loadChartData}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
        >
          Actualizar
        </button>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="time" 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            
            {selectedCryptos.map((crypto, index) => (
              <Line
                key={crypto.id}
                type="monotone"
                dataKey={crypto.symbol}
                stroke={getCryptoChartColor(crypto.symbol)}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2 }}
                connectNulls={true}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        Los precios se actualizan automáticamente. Última actualización: {new Date().toLocaleTimeString('es-ES')}
      </div>
    </div>
  );
} 