import { useState, useEffect } from 'react';
import { healthService } from '../services/api';

export default function ApiHealth() {
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
  );
}
