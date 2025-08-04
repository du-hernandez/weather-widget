import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { message } from 'antd';
import { useAppSelector } from '@shared/hooks/redux';
import { useWeatherLoading } from '@shared/hooks/useLoading';
import { selectSelectedCity, selectSelectedCoordinates } from '@features/weather/store/selectors';
import SearchBar from '@features/search/components/SearchBar';
import SearchSuggestions from '@features/search/components/SearchSuggestions';
import CurrentWeather from '@features/weather/components/CurrentWeather';
import ProgressBarWrapper from '@app/components/ProgressBarWrapper';
import RecentSearchesPanel from '@features/search/components/RecentSearchesPanel';
import { MapWrapper } from '@features/map/components/MapWrapper';
import { useWeatherAndForecast } from '@features/weather/hooks/useWeather';
import { useAppDispatch } from '@shared/hooks/redux';
import { setError, setSelectedCity } from '@features/weather/store/weatherSlice';
import type { SearchResult } from '@features/search/types';
import { useLastUpdateTime } from '@shared/hooks/useLastUpdateTime';
import { useAutoScroll } from '@shared/hooks/useAutoScroll';
import { clearHistory } from '@/features/search/store/searchSlice';
import { useLazyBackground } from '@shared/hooks/useLazyBackground';
import '@app/styles/index.scss';
import { useMapState } from '@/features/map/hooks/useMapState';
import { setSelectedLocation } from '@/features/map/store/mapSlice';
import { MAP_CONSTANTS } from '@/shared/utils';

const WeatherWidget: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedCity = useAppSelector(selectSelectedCity);
  const selectedCoordinates = useAppSelector(selectSelectedCoordinates);
  const { isLoading, error } = useWeatherLoading();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const hideTimeoutRef = useRef<number | null>(null);
  const { updateCenter, updateZoom } = useMapState();
  
  // LazyLoading para el fondo
  const { backgroundImage } = useLazyBackground({
    placeholderUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyMCIgaGVpZ2h0PSIxMDgwIiB2aWV3Qm94PSIwIDAgMTkyMCAxMDgwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8ZGVmcz4KICA8bGluZWFyR3JhZGllbnQgaWQ9IndlYXRoZXJHcmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CiAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNjY3ZWVhO3N0b3Atb3BhY2l0eToxIiAvPgogICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNzY0YmEyO3N0b3Atb3BhY2l0eToxIiAvPgogIDwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KCjwhLS0gR3JhZGllbnQgYmFja2dyb3VuZCAtLT4KPHJlY3Qgd2lkdGg9IjE5MjAiIGhlaWdodD0iMTA4MCIgZmlsbD0idXJsKCN3ZWF0aGVyR3JhZGllbnQpIiAvPgoKPCEtLSBFZGlmaWNpb3MgLS0+CjxyZWN0IHg9IjEwMCIgeT0iNjAwIiB3aWR0aD0iODAiIGhlaWdodD0iNDgwIiBmaWxsPSIjMzMzMzMzIiAvPgo8cmVjdCB4PSIyMDAiIHk9IjUwMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSI1ODAiIGZpbGw9IiM0NDQ0NDQiIC8+CjxyZWN0IHg9IjMyMCIgeT0iNzAwIiB3aWR0aD0iNjAiIGhlaWdodD0iMzgwIiBmaWxsPSIjNTU1NTU1IiAvPgo8cmVjdCB4PSI0MDAiIHk9IjQwMCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSI2ODAiIGZpbGw9IiMzMzMzMzMiIC8+CjxyZWN0IHg9IjU0MCIgeT0iNjUwIiB3aWR0aD0iODAiIGhlaWdodD0iNDMwIiBmaWxsPSIjNDQ0NDQ0IiAvPgo8cmVjdCB4PSI2NDAiIHk9IjU1MCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSI1MzAiIGZpbGw9IiM1NTU1NTUiIC8+CjxyZWN0IHg9Ijc2MCIgeT0iNzAwIiB3aWR0aD0iNzAiIGhlaWdodD0iMzgwIiBmaWxsPSIjMzMzMzMzIiAvPgo8cmVjdCB4PSI4NTAiIHk9IjQ1MCIgd2lkdGg9IjExMCIgaGVpZ2h0PSI2MzAiIGZpbGw9IiM0NDQ0NDQiIC8+CjxyZWN0IHg9Ijk4MCIgeT0iNjAwIiB3aWR0aD0iOTAiIGhlaWdodD0iNDgwIiBmaWxsPSIjNTU1NTU1IiAvPgo8cmVjdCB4PSIxMDkwIiB5PSI1MDAiIHdpZHRoPSIxMDAiIGhlaWdodD0iNTgwIiBmaWxsPSIjMzMzMzMzIiAvPgo8cmVjdCB4PSIxMjEwIiB5PSI2NTAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI0MzAiIGZpbGw9IiM0NDQ0NDQiIC8+CjxyZWN0IHg9IjEzMTAiIHk9IjQwMCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSI2ODAiIGZpbGw9IiM1NTU1NTUiIC8+CjxyZWN0IHg9IjE0NTAiIHk9IjU1MCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSI1MzAiIGZpbGw9IiMzMzMzMzMiIC8+CjxyZWN0IHg9IjE1NzAiIHk9IjY1MCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjQzMCIgZmlsbD0iIzQ0NDQ0NCIgLz4KCjwhLS0gVmVudGFuYXMgZGUgbG9zIGVkaWZpY2lvcyAtLT4KPHJlY3QgeD0iMTEwIiB5PSI2MDAiIHdpZHRoPSI2MCIgaGVpZ2h0PSI0MCIgZmlsbD0iIzIyMjIyMiIgLz4KPHJlY3QgeD0iMjEwIiB5PSI1MDAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI0MCIgZmlsbD0iIzIyMjIyMiIgLz4KPHJlY3QgeD0iMzMwIiB5PSI3MDAiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0iIzIyMjIyMiIgLz4KPHJlY3QgeD0iNDEwIiB5PSI0MDAiIHdpZHRoPSIxMDAiIGhlaWdodD0iNDAiIGZpbGw9IiMyMjIyMjIiIC8+CjxyZWN0IHg9IjU1MCIgeT0iNjUwIiB3aWR0aD0iNjAiIGhlaWdodD0iNDAiIGZpbGw9IiMyMjIyMjIiIC8+CjxyZWN0IHg9IjY1MCIgeT0iNTUwIiB3aWR0aD0iODAiIGhlaWdodD0iNDAiIGZpbGw9IiMyMjIyMjIiIC8+CjxyZWN0IHg9Ijc3MCIgeT0iNzAwIiB3aWR0aD0iNTAiIGhlaWdodD0iNDAiIGZpbGw9IiMyMjIyMjIiIC8+CjxyZWN0IHg9Ijg2MCIgeT0iNDUwIiB3aWR0aGg9IjkwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMjIyMjIyIiAvPgo8cmVjdCB4PSI5OTAiIHk9IjYwMCIgd2lkdGg9IjcwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMjIyMjIyIiAvPgo8cmVjdCB4PSIxMTAwIiB5PSI1MDAiIHdpZHRoPSI4MCIgaGVpZ2h0PSI0MCIgZmlsbD0iIzIyMjIyMiIgLz4KPHJlY3QgeD0iMTIyMCIgeT0iNjUwIiB3aWR0aD0iNjAiIGhlaWdodD0iNDAiIGZpbGw9IiMyMjIyMjIiIC8+CjxyZWN0IHg9IjEzMjAiIHk9IjQwMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSI0MCIgZmlsbD0iIzIyMjIyMiIgLz4KPHJlY3QgeD0iMTQ2MCIgeT0iNTUwIiB3aWR0aD0iODAiIGhlaWdodD0iNDAiIGZpbGw9IiMyMjIyMjIiIC8+CjxyZWN0IHg9IjE1ODAiIHk9IjY1MCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMjIyMjIyIiAvPgoKPCEtLSBOdWJlcyBlbiBsb3MgZWRpZmljaW9zIC0tPgo8cmVjdCB4PSIxMjAiIHk9IjYxMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjNjY2ZmZmIiAvPgo8cmVjdCB4PSIyMjAiIHk9IjUxMCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjNjY2ZmZmIiAvPgo8cmVjdCB4PSIzNDAiIHk9IjcxMCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjNjY2ZmZmIiAvPgo8cmVjdCB4PSI0MjAiIHk9IjQxMCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjNjY2ZmZmIiAvPgo8cmVjdCB4PSI1NjAiIHk9IjY2MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjNjY2ZmZmIiAvPgo8cmVjdCB4PSI2NjAiIHk9IjU2MCIgd2lkdGg9IjYwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjNjY2ZmZmIiAvPgo8cmVjdCB4PSI3ODAiIHk9IjcwMCIgd2lkdGg9IjMwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjNjY2ZmZmIiAvPgo8cmVjdCB4PSI4NzAiIHk9IjQ2MCIgd2lkdGg9IjcwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjNjY2ZmZmIiAvPgo8cmVjdCB4PSIxMDAwIiB5PSI2MTAiIHdpZHRoPSI1MCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzY2NmZmZiIgLz4KPHJlY3QgeD0iMTExMCIgeT0iNTEwIiB3aWR0aD0iNjAiIGhlaWdodD0iMjAiIGZpbGw9IiM2NjZmZmYiIC8+CjxyZWN0IHg9IjEyMzAiIHk9IjY2MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjNjY2ZmZmIiAvPgo8cmVjdCB4PSIxMzMwIiB5PSI0MTAiIHdpZHRoPSI4MCIgaGVpZ2h0PSIyMCIgZmlsbD0iIzY2NmZmZiIgLz4KPHJlY3QgeD0iMTQ3MCIgeT0iNTYwIiB3aWR0aD0iNjAiIGhlaWdodD0iMjAiIGZpbGw9IiM2NjZmZmYiIC8+CjxyZWN0IHg9IjE1OTAiIHk9IjY2MCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjNjY2ZmZmIiAvPgoKPCEtLSBDbG91ZCBwYXR0ZXJucyAtLT4KPGNpcmNsZSBjeD0iMzAwIiBjeT0iMjAwIiByPSI2MCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIiAvPgo8Y2lyY2xlIGN4PSI2MDAiIGN5PSIxNTAiIHI9IjQwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDgpIiAvPgo8Y2lyY2xlIGN4PSI5MDAiIGN5PSIyNTAiIHI9IjMwIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDYpIiAvPgo8Y2lyY2xlIGN4PSIxMjAwIiBjeT0iMTgwIiByPSI1MCIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA5KSIgLz4KPGNpcmNsZSBjeD0iMTUwMCIgY3k9IjMwMCIgcj0iMzUiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNykiIC8+Cgo8IS0tIFN1bi9tb29uIGVsZW1lbnQgLS0+CjxjaXJjbGUgY3g9IjE2MDAiIGN5PSIxNTAiIHI9IjYwIiBmaWxsPSJyZ2JhKDI1NSwyMTUsMTUwLDAuMTUpIiAvPgo8Y2lyY2xlIGN4PSIxNjAwIiBjeT0iMTUwIiByPSI0MCIgZmlsbD0idXJsKCN3ZWF0aGVyR3JhZGllbnQpIiAvPgoKPCEtLSBTdWJ0bGUgb3ZlcmxheSBmb3IgZGVwdGggLS0+CjxyZWN0IHdpZHRoPSIxOTIwIiBoZWlnaHQ9IjEwODAiIGZpbGw9InJnYmEoMCwwLDAsMC4yKSIgLz4KCjwvc3ZnPgo=',
    realImageUrl: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80',
    onLoad: () => {
      console.log('🎨 Imagen de fondo cargada exitosamente');
    },
    onError: () => {
      console.log('⚠️ Error al cargar la imagen de fondo, usando placeholder');
    }
  });
  
  // Hook personalizado para manejar lastUpdateTime
  const { lastUpdateTime, hasInitialData, updateLastUpdateTime } = useLastUpdateTime();
  
  // Hook para auto-scroll
  const { scrollToTop } = useAutoScroll();

  const [messageApi, contextHolder] = message.useMessage();

  // Memoizar los parámetros del hook para evitar re-ejecuciones innecesarias
  const weatherParams = useMemo(() => {
    // Si tenemos coordenadas seleccionadas, usarlas
    if (selectedCoordinates) {
      return { lat: selectedCoordinates.lat, lon: selectedCoordinates.lon };
    }
    // Si tenemos ciudad seleccionada, usarla
    else if (selectedCity) {
      // Para más exactitud buscamos por coordenadas
      // El nombre de la ciudad puede estar repetido en un mismno país
      return { lat: selectedCity.lat, lon: selectedCity.lon };
    }
    // Si no hay nada seleccionado, retornar objeto vacío
    return {};
  }, [selectedCity, selectedCoordinates]);

  // Callback que se ejecuta cuando se completan los datos climáticos
  const handleWeatherDataLoaded = useCallback(() => {
    updateLastUpdateTime();
    // Auto-scroll a la parte superior después de cargar los datos
    scrollToTop(500); // Delay más largo para asegurar que los datos estén renderizados
  }, [updateLastUpdateTime, scrollToTop]);

  // Hook para clima - se ejecuta automáticamente cuando selectedCity o selectedCoordinates cambian
  // Solo actualiza lastUpdateTime cuando se obtienen los datos exitosamente
  useWeatherAndForecast(
    weatherParams,
    handleWeatherDataLoaded // Callback que se ejecuta cuando se completan los datos
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
    dispatch(setSelectedCity(suggestion));
    setShowSuggestions(false);
    
    // Establece icono de ubicación en el mapa
    dispatch(setSelectedLocation({
      lat: suggestion.lat,
      lng: suggestion.lon,
      city: suggestion.name,
      country: suggestion.country,
      timestamp: Date.now(),
    }));

    updateCenter([suggestion.lat, suggestion.lon]);
    updateZoom(MAP_CONSTANTS.DEFAULT_ZOOM);
  }, [dispatch, scrollToTop]);

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
  const handleHistorySearch = useCallback((city: SearchResult) => {
    dispatch(setSelectedCity(city));
    
    // Auto-scroll a la parte superior después de seleccionar del historial
    scrollToTop(300);
  }, [dispatch, scrollToTop]);

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
      {/* Fondo que cubre toda la pantalla con LazyLoading */}
      <div 
        className="weather-widget-background" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${backgroundImage}')` 
        }}
      />
      
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

          {/* Mapa interactivo - Grid Area: map */}
          <div style={{ gridArea: 'map' }}>
            <MapWrapper />
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