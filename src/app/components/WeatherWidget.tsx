import React, { useState } from 'react';
import { useAppSelector } from '@shared/hooks/redux';
import { useWeatherLoading } from '@shared/hooks/useLoading';
import { selectSelectedCity } from '@features/weather/store/selectors';
import SearchBar from '@features/search/components/SearchBar';
import SearchSuggestions from '@features/search/components/SearchSuggestions';
import CurrentWeather from '@features/weather/components/CurrentWeather';
import ProgressBar from '@app/components/ProgressBar';
import { useWeatherAndForecast } from '@features/weather/hooks/useWeather';
import { useAppDispatch } from '@shared/hooks/redux';
import { setSelectedCity } from '@features/weather/store/weatherSlice';
import type { SearchResult } from '@features/search/types';
import { useErrorMessage } from '@shared/hooks/useErrorMessage';
import '@app/styles/index.scss';

const WeatherWidget: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedCity = useAppSelector(selectSelectedCity);
  const { isLoading, error } = useWeatherLoading();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

  // Hook para clima - se ejecuta automáticamente cuando selectedCity cambia
  useWeatherAndForecast({ q: selectedCity || '' });

  // Hook para mostrar mensajes de error flotantes
  useErrorMessage(error);

  const handleSearch = (query: string) => {
    setCurrentQuery(query);
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (suggestion: SearchResult) => {
    // Usar el nombre más apropiado para la búsqueda
    // Preferir el nombre local en español si está disponible, sino usar el nombre principal
    const cityName = suggestion.local_names?.es || 
                     suggestion.local_names?.en || 
                     suggestion.name;
    
    // Crear búsqueda precisa con ciudad y código de país
    const preciseSearch = `${cityName},${suggestion.country}`;
    
    // Actualizar la ciudad seleccionada en Redux con búsqueda precisa
    dispatch(setSelectedCity(preciseSearch));
    
    setShowSuggestions(false);
    setCurrentQuery('');
    setLastUpdateTime(new Date()); // Actualizar tiempo cuando se selecciona nueva ciudad
  };

  return (
    <>
      {/* Fondo que cubre toda la pantalla */}
      <div className="weather-widget-background" />
      
      {/* Contenido principal */}
      <div className="weather-widget">
        <div className="weather-widget__container">
          
          {/* Barra de búsqueda - Grid Area: search */}
          <div style={{ gridArea: 'search' }}>
            <div className="glass-effect search-panel" style={{ padding: '16px', position: 'relative' }}>
              <SearchBar
                onSearch={handleSearch}
                loading={isLoading}
                placeholder="Buscar ciudad..."
              />
            </div>
          </div>

          {/* Barra de progreso - Grid Area: progress */}
          <div style={{ gridArea: 'progress' }}>
            <ProgressBar lastUpdateTime={lastUpdateTime} maxTime={10} />
          </div>

          {/* Panel del clima - Grid Area: weather */}
          <div style={{ gridArea: 'weather' }}>
            <div className="glass-effect" style={{ height: '100%', padding: '24px' }}>
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

      {/* SearchSuggestions fuera del contenedor para contexto de apilamiento independiente */}
      {showSuggestions && currentQuery && (
        <SearchSuggestions
          query={currentQuery}
          onSelectSuggestion={handleSelectSuggestion}
          visible={showSuggestions}
        />
      )}
    </>
  );
};

export default WeatherWidget; 