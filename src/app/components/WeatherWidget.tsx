import React, { useState } from 'react';
import { Alert } from 'antd';
import { useAppSelector } from '@shared/hooks/redux';
import { useLoading } from '@shared/hooks/useLoading';
import { selectSelectedCity, selectUnits } from '@features/weather/store/selectors';
import SearchBar from '@features/search/components/SearchBar';
import SearchSuggestions from '@features/search/components/SearchSuggestions';
import CurrentWeather from '@features/weather/components/CurrentWeather';
import { useWeatherAndForecast } from '@features/weather/hooks/useWeather';
import { useAppDispatch } from '@shared/hooks/redux';
import { setSelectedCity } from '@features/weather/store/weatherSlice';
import type { SearchResult } from '@features/search/types';
import '@app/styles/index.scss';

const WeatherWidget: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedCity = useAppSelector(selectSelectedCity);
  const units = useAppSelector(selectUnits);
  const { isLoading, error } = useLoading();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');

  // Hook para clima - se ejecuta automáticamente cuando selectedCity cambia
  useWeatherAndForecast({ q: selectedCity || '' });

  const handleSearch = (query: string) => {
    setCurrentQuery(query);
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (suggestion: SearchResult) => {
    // Actualizar la ciudad seleccionada en Redux
    dispatch(setSelectedCity(suggestion.name));
    
    setShowSuggestions(false);
    setCurrentQuery('');
  };

  return (
    <div className="weather-widget">
      <div className="weather-widget__container">
        
        {/* Barra de búsqueda - Grid Area: search */}
        <div style={{ gridArea: 'search' }}>
          <div className="glass-effect" style={{ padding: '16px', position: 'relative' }}>
            <SearchBar
              onSearch={handleSearch}
              loading={isLoading}
              placeholder="Buscar ciudad..."
            />
            
            {/* Sugerencias */}
            {showSuggestions && currentQuery && (
              <SearchSuggestions
                query={currentQuery}
                onSelectSuggestion={handleSelectSuggestion}
                visible={showSuggestions}
              />
            )}
          </div>
        </div>

        {/* Panel del clima - Grid Area: weather */}
        <div style={{ gridArea: 'weather' }}>
          <div className="glass-effect" style={{ height: '100%', padding: '24px' }}>
            {error && (
              <Alert
                message="Error"
                description={error}
                type="error"
                showIcon
                closable
                style={{ marginBottom: '16px' }}
              />
            )}

            {selectedCity && (
              <Alert
                message={`Ciudad seleccionada: ${selectedCity}`}
                description={`Unidades: ${units === 'metric' ? 'Métrico (°C)' : 'Imperial (°F)'}`}
                type="info"
                showIcon
                closable
                style={{ marginBottom: '16px' }}
              />
            )}

            <CurrentWeather />
          </div>
        </div>

        {/* Panel histórico - Grid Area: history */}
        <div style={{ gridArea: 'history' }}>
          <div className="glass-effect" style={{ height: '100%', padding: '24px', minWidth: '280px' }}>
            <h3 className="text-shadow" style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>
              Búsquedas recientes
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Historial de búsquedas aquí...
            </p>
          </div>
        </div>

        {/* Espacio para mapa - Grid Area: map */}
        <div style={{ gridArea: 'map' }}>
          <div className="glass-effect" style={{ height: '200px', padding: '24px' }}>
            <h3 className="text-shadow" style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>
              Mapa
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Espacio reservado para implementación del mapa...
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default WeatherWidget; 