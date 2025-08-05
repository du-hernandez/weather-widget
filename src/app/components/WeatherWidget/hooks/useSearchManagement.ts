import { useState, useCallback, useRef, useEffect } from 'react';
import { useAppDispatch } from '@shared/hooks/redux';
import { setSelectedCity } from '@features/weather/store/weatherSlice';
import { setSelectedLocation } from '@/features/map/store/mapSlice';
import { useMapState } from '@/features/map/hooks/useMapState';
import { MAP_CONSTANTS } from '@/shared/utils';
import type { SearchResult } from '@features/search/types';

interface UseSearchManagementProps {
  onScrollToTop: (delay?: number) => void;
}

export const useSearchManagement = ({ onScrollToTop }: UseSearchManagementProps) => {
  const dispatch = useAppDispatch();
  const { updateCenter, updateZoom } = useMapState();
  
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const hideTimeoutRef = useRef<number | null>(null);

  // Cleanup del timeout al desmontar
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

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
    
    // Auto-scroll a la parte superior después de seleccionar sugerencia
    onScrollToTop(300);
  }, [dispatch, onScrollToTop, updateCenter, updateZoom]);

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

  return {
    showSuggestions,
    currentQuery,
    handleSearch,
    handleSelectSuggestion,
    handleFocus,
    handleBlur,
  };
}; 