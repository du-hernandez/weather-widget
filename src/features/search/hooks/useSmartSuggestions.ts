import { useAppSelector } from '@shared/hooks/redux';
import { useSearchCities } from './useSearch';
import { selectRecentSearchHistory } from '../store/selectors';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

/**
 * Hook para sugerencias inteligentes con prioridad de historial
 * @param query - Query de búsqueda
 * @returns Sugerencias y fuente de datos
 */
export const useSmartSuggestions = (query: string) => {
  const recentHistory = useAppSelector(selectRecentSearchHistory);
  const queryClient = useQueryClient();
  
  // Buscar en API si hay query válido (2+ caracteres)
  const shouldSearchAPI = query.length >= 2;
  
  // Aumentar el límite para mostrar más sugerencias
  const { data: apiResults, isLoading } = useSearchCities({
    q: query, // Usar query directo en lugar de debouncedQuery
    limit: 20, // Aumentado de 5 a 20 sugerencias
  });

  // Limpiar cache cuando cambia la query para forzar nueva búsqueda
  React.useEffect(() => {
    if (shouldSearchAPI) {
      // Limpiar cache específico para esta query
      queryClient.removeQueries({
        queryKey: ['search', 'cities', { q: query, limit: 5 }], // Limpiar cache viejo
      });
    }
  }, [query, shouldSearchAPI, queryClient]);

  const suggestions = apiResults || [];

  const source = recentHistory.length > 0 ? 'history' : 'api';

  return {
    suggestions,
    source,
    isLoading: shouldSearchAPI ? isLoading : false,
    hasHistory: recentHistory.length > 0,
    hasApiResults: (apiResults?.length || 0) > 0,
  };
}; 