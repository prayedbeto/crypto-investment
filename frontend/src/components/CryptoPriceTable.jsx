import React from 'react';
import { formatPrice, calculatePriceChange, getCryptoColor } from '../utils/cryptoUtils';

const CryptoPriceTable = ({ selectedCryptos, pricesData }) => {
  if (!selectedCryptos || selectedCryptos.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Últimos Precios
        </h3>
        <div className="text-center py-8 text-gray-500">
          <p>Selecciona criptomonedas para ver sus precios</p>
        </div>
      </div>
    );
  }

  // Función para obtener el último precio de una criptomoneda
  const getLatestPrice = (cryptoId) => {
    if (!pricesData || !pricesData[cryptoId]) return null;
    
    const cryptoData = pricesData[cryptoId];
    if (!cryptoData.prices || !Array.isArray(cryptoData.prices) || cryptoData.prices.length === 0) {
      return null;
    }
    
    // Ordenar por fecha y tomar el más reciente
    const sortedPrices = [...cryptoData.prices].sort((a, b) => 
      new Date(b.recorded_at) - new Date(a.recorded_at)
    );
    
    return sortedPrices[0];
  };

  // Función para obtener el precio anterior para calcular el cambio
  const getPreviousPrice = (cryptoId) => {
    if (!pricesData || !pricesData[cryptoId]) return null;
    
    const cryptoData = pricesData[cryptoId];
    if (!cryptoData.prices || !Array.isArray(cryptoData.prices) || cryptoData.prices.length < 2) {
      return null;
    }
    
    // Ordenar por fecha y tomar el segundo más reciente
    const sortedPrices = [...cryptoData.prices].sort((a, b) => 
      new Date(b.recorded_at) - new Date(a.recorded_at)
    );
    
    return sortedPrices[1];
  };

  return (
    <div className="card">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Últimos Precios ({selectedCryptos.length} criptomonedas)
      </h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Criptomoneda
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Símbolo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Último Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cambio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Última Actualización
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {selectedCryptos.map((crypto) => {
              const latestPrice = getLatestPrice(crypto.id);
              const previousPrice = getPreviousPrice(crypto.id);
              const priceChange = latestPrice && previousPrice 
                ? calculatePriceChange(latestPrice.price, previousPrice.price)
                : null;
              
              return (
                <tr key={crypto.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: getCryptoColor(crypto.symbol) }}
                      >
                        {crypto.symbol.charAt(0)}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {crypto.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Rank #{crypto.rank}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {crypto.symbol}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {latestPrice ? (
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(latestPrice.price)}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        Sin datos
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {priceChange ? (
                      <div className={`text-sm font-medium ${
                        priceChange.percentage > 0 
                          ? 'text-green-600' 
                          : priceChange.percentage < 0 
                            ? 'text-red-600' 
                            : 'text-gray-600'
                      }`}>
                        {priceChange.percentage > 0 ? '+' : ''}{priceChange.percentage.toFixed(2)}%
                        <span className="ml-1 text-xs">
                          ({priceChange.absolute > 0 ? '+' : ''}{formatPrice(priceChange.absolute)})
                        </span>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        -
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {latestPrice ? (
                      new Date(latestPrice.recorded_at).toLocaleString('es-ES', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    ) : (
                      'Sin datos'
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {selectedCryptos.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No hay criptomonedas seleccionadas</p>
        </div>
      )}
    </div>
  );
};

export default CryptoPriceTable; 