import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { message } from 'antd';
import { useAppSelector } from '@shared/hooks/redux';
import { useWeatherLoading } from '@shared/hooks/useLoading';
import { selectSelectedCity } from '@features/weather/store/selectors';
import SearchBar from '@features/search/components/SearchBar';
import SearchSuggestions from '@features/search/components/SearchSuggestions';
import CurrentWeather from '@features/weather/components/CurrentWeather';
import ProgressBarWrapper from '@app/components/ProgressBarWrapper';
import RecentSearchesPanel from '@features/search/components/RecentSearchesPanel';
import { useWeatherAndForecast } from '@features/weather/hooks/useWeather';
import { useAppDispatch } from '@shared/hooks/redux';
import { setError, setSelectedCity } from '@features/weather/store/weatherSlice';
import type { SearchResult } from '@features/search/types';
import { useLastUpdateTime } from '@shared/hooks/useLastUpdateTime';
import { setCurrentQuery as setCurrentQuerySearch, clearHistory } from '@/features/search/store/searchSlice';
import { cleanCityNameForWeatherAPI } from '@shared/utils';
import '@app/styles/index.scss';

const WeatherWidget: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedCity = useAppSelector(selectSelectedCity);
  const { isLoading, error } = useWeatherLoading();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const hideTimeoutRef = useRef<number | null>(null);
  
  // Hook personalizado para manejar lastUpdateTime
  const { lastUpdateTime, hasInitialData, updateLastUpdateTime } = useLastUpdateTime();

  const [messageApi, contextHolder] = message.useMessage();

  // Memoizar los parámetros del hook para evitar re-ejecuciones innecesarias
  const weatherParams = useMemo(() => ({ 
    q: selectedCity || '' 
  }), [selectedCity]);

  // Hook para clima - se ejecuta automáticamente cuando selectedCity cambia
  // Solo actualiza lastUpdateTime cuando se obtienen los datos exitosamente
  useWeatherAndForecast(
    weatherParams,
    updateLastUpdateTime // Callback que se ejecuta solo cuando se obtienen los datos
  );

  // Manejo de errores con limpieza automática en Redux
  useEffect(() => {
    if (error) {
      messageApi.warning(error);
      
      setTimeout(() => {
        dispatch(setError(''));
      }, 1000);
    }
  }, [error, dispatch]);

  // Memoizar handlers para evitar re-renders
  const handleSearch = useCallback((query: string) => {
    setCurrentQuery(query);
    setShowSuggestions(true);
  }, []);

  const handleSelectSuggestion = useCallback((suggestion: SearchResult) => {
    // Usar el nombre más apropiado para la búsqueda
    // Preferir el nombre local en español si está disponible, sino usar el nombre principal
    const cityName = suggestion.local_names?.es || 
                     suggestion.local_names?.en || 
                     suggestion.name;
    
    // Crear búsqueda precisa con ciudad limpia y código de país
    const preciseSearch = cleanCityNameForWeatherAPI(cityName, suggestion.country);
    
    // Actualizar la ciudad seleccionada en Redux con búsqueda precisa
    dispatch(setSelectedCity(preciseSearch));
    
    setShowSuggestions(false);
  }, [dispatch]);

  // Handlers para el foco del SearchBar
  const handleFocus = useCallback(() => {
    // Limpiar timeout si existe
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    
    // Mostrar sugerencias si hay query
    if (currentQuery.trim().length >= 2) {
      setShowSuggestions(true);
    }
  }, [currentQuery]);

  const handleBlur = useCallback(() => {
    
    // Limpiar timeout anterior si existe
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    
    // Ocultar sugerencias después de un pequeño delay
    // para permitir que el usuario haga clic en las sugerencias
    hideTimeoutRef.current = window.setTimeout(() => {
      setShowSuggestions(false);
    }, 150); // 150ms de delay
  }, []);

  // Cleanup del timeout al desmontar
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  // Handler para seleccionar búsqueda del historial
  const handleHistorySearch = useCallback((city: string, country: string) => {
    const preciseSearch = cleanCityNameForWeatherAPI(city, country);
    dispatch(setSelectedCity(preciseSearch));
    // dispatch(setCurrentQuerySearch(city));
  }, [dispatch]);

  // Handler para limpiar historial
  const handleClearHistory = useCallback(() => {
    dispatch(clearHistory());
  }, [dispatch, messageApi]);

  // Memoizar props del SearchBar
  const searchBarProps = useMemo(() => ({
    onSearch: handleSearch,
    loading: isLoading,
    placeholder: "Buscar ciudad...",
    onFocus: handleFocus,
    onBlur: handleBlur
  }), [handleSearch, isLoading, handleFocus, handleBlur]);

  // Memoizar props del SearchSuggestions
  const searchSuggestionsProps = useMemo(() => ({
    query: currentQuery,
    onSelectSuggestion: handleSelectSuggestion,
    visible: showSuggestions
  }), [currentQuery, handleSelectSuggestion, showSuggestions]);

  // Memoizar props del RecentSearchesPanel
  const recentSearchesProps = useMemo(() => ({
    onSelectSearch: handleHistorySearch,
    onClearHistory: handleClearHistory
  }), [handleHistorySearch, handleClearHistory]);

  return (
    <>
      {contextHolder}
      {/* Fondo que cubre toda la pantalla */}
      <div className="weather-widget-background" />
      
      {/* Contenido principal */}
      <div className="weather-widget">
        <div className="weather-widget__container">
          
          {/* Barra de búsqueda - Grid Area: search */}
          <div style={{ gridArea: 'search' }}>
            <div className="glass-effect search-panel" style={{ padding: '16px', position: 'relative' }}>
              <SearchBar {...searchBarProps} />
            </div>
          </div>

          {/* Barra de progreso optimizada - Grid Area: progress */}
          <ProgressBarWrapper 
            lastUpdateTime={lastUpdateTime} 
            hasInitialData={hasInitialData}
          />

          {/* Panel del clima - Grid Area: weather */}
          <div style={{ gridArea: 'weather' }}>
              <CurrentWeather />
          </div>

          {/* Panel histórico - Grid Area: history */}
          <div style={{ gridArea: 'history' }}>
            <RecentSearchesPanel {...recentSearchesProps} />
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
        <SearchSuggestions {...searchSuggestionsProps} />
      )}
    </>
  );
};

export default WeatherWidget; 