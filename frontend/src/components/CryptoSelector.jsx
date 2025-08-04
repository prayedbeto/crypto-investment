import React, { useState, useEffect, useRef } from 'react';
import { cryptocurrencyService } from '../services/api';

const CryptoSelector = ({ selectedCryptos, onSelectionChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchTimeoutRef = useRef(null);

  // Búsqueda en tiempo real con debounce
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    setShowDropdown(true);

    // Debounce de 300ms
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await cryptocurrencyService.search(searchTerm);
        setSearchResults(response.data.data || []);
      } catch (error) {
        console.error('Error buscando criptomonedas:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  const handleCryptoSelect = (crypto) => {
    const isAlreadySelected = selectedCryptos.some(selected => selected.id === crypto.id);
    
    if (!isAlreadySelected) {
      // Si hay un término de búsqueda, reemplazar la selección actual
      if (searchTerm.trim() !== '') {
        onSelectionChange([crypto]);
      } else {
        // Si no hay búsqueda, agregar a la selección existente
        const newSelection = [...selectedCryptos, crypto];
        onSelectionChange(newSelection);
      }
    }
    
    setSearchTerm('');
    setShowDropdown(false);
  };

  const handleCryptoRemove = (cryptoId) => {
    const newSelection = selectedCryptos.filter(crypto => crypto.id !== cryptoId);
    onSelectionChange(newSelection);
  };

  const handleClearSelection = () => {
    onSelectionChange([]);
  };

  const isSelected = (cryptoId) => {
    return selectedCryptos.some(crypto => crypto.id === cryptoId);
  };

  return (
    <div className="relative">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Seleccionar Criptomonedas
        </label>
        
        {/* Input de búsqueda */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            placeholder="Buscar criptomonedas (ej: bitcoin, BTC, ethereum)..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          
          {isSearching && (
            <div className="absolute right-3 top-2.5">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
            </div>
          )}
        </div>

        {/* Dropdown de resultados */}
        {showDropdown && searchResults.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {searchResults.map((crypto) => (
              <div
                key={crypto.id}
                onClick={() => handleCryptoSelect(crypto)}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                  isSelected(crypto.id) ? 'bg-primary-50 text-primary-700' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">{crypto.name}</span>
                    <span className="text-gray-500 ml-2">({crypto.symbol})</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Rank #{crypto.rank}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Mensaje cuando no hay resultados */}
        {showDropdown && searchTerm && !isSearching && searchResults.length === 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-3 text-gray-500">
            No se encontraron criptomonedas para "{searchTerm}"
          </div>
        )}
      </div>

      {/* Criptomonedas seleccionadas */}
      {selectedCryptos.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-gray-700">
              Criptomonedas Seleccionadas ({selectedCryptos.length})
            </h4>
            <button
              onClick={handleClearSelection}
              className="text-xs text-red-600 hover:text-red-800 font-medium"
            >
              Limpiar todo
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedCryptos.map((crypto) => (
              <div
                key={crypto.id}
                className="flex items-center bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm"
              >
                <span className="font-medium">{crypto.symbol}</span>
                <span className="ml-1 text-primary-600">({crypto.name})</span>
                <button
                  onClick={() => handleCryptoRemove(crypto.id)}
                  className="ml-2 text-primary-600 hover:text-primary-800 focus:outline-none"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Click fuera para cerrar dropdown */}
      {showDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};

export default CryptoSelector; 