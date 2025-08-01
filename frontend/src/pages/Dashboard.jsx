import { useState, useEffect } from 'react';
import { healthService } from '../services/api';

export default function Dashboard() {
  const [apiStatus, setApiStatus] = useState('checking');
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await healthService.check();
        setApiData(response.data);
        setApiStatus('connected');
      } catch (error) {
        console.error('Error checking API health:', error);
        setApiStatus('error');
      }
    };

    checkApiHealth();
  }, []);

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

        {/* API Status Card */}
        <div className="mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Estado de la API
                </h3>
                <p className="text-sm text-gray-500">
                  Verificación de conectividad con el backend
                </p>
              </div>
              <div className="flex items-center">
                {apiStatus === 'checking' && (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                )}
                {apiStatus === 'connected' && (
                  <div className="h-6 w-6 bg-crypto-success rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
                {apiStatus === 'error' && (
                  <div className="h-6 w-6 bg-crypto-danger rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✗</span>
                  </div>
                )}
              </div>
            </div>
            {apiData && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <pre className="text-sm text-gray-700 overflow-x-auto">
                  {JSON.stringify(apiData, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-crypto-bitcoin rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">₿</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Portfolio Total</p>
                <p className="text-2xl font-semibold text-gray-900">$0.00</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-crypto-success rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">+</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Ganancia 24h</p>
                <p className="text-2xl font-semibold text-crypto-success">+0.00%</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-crypto-ethereum rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Ξ</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Activos</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">$</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Balance USD</p>
                <p className="text-2xl font-semibold text-gray-900">$0.00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Actividad Reciente
            </h3>
            <div className="space-y-4">
              <div className="text-center py-8 text-gray-500">
                <p>No hay actividad reciente</p>
                <p className="text-sm">Las transacciones aparecerán aquí</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Acciones Rápidas
            </h3>
            <div className="space-y-3">
              <button className="w-full btn btn-primary">
                Comprar Criptomonedas
              </button>
              <button className="w-full btn btn-secondary">
                Ver Mercado
              </button>
              <button className="w-full btn btn-secondary">
                Gestionar Portfolio
              </button>
            </div>
          </div>
        </div>

        {/* Market Overview */}
        <div className="mt-8">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Resumen del Mercado
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Criptomoneda
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cambio 24h
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Volumen
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-crypto-bitcoin rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">₿</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">Bitcoin</div>
                          <div className="text-sm text-gray-500">BTC</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      $0.00
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      +0.00%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      $0.00
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 