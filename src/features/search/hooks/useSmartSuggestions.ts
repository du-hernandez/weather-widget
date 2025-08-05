import { useEffect } from 'react';
import { useSearchCities } from './useSearch';
import { useQueryClient } from '@tanstack/react-query';
import { serializeParams } from '@shared/utils/query-keys';

/**
 * Hook para sugerencias inteligentes con prioridad de historial
 * @param query - Query de búsqueda
 * @returns Sugerencias y fuente de datos
 */
export const useSmartSuggestions = (query: string) => {
  // const recentHistory = useAppSelector(selectRecentSearchHistory);
  const queryClient = useQueryClient();
  
  // Buscar en API si hay query válido (2+ caracteres)
  const shouldSearchAPI = query.length >= 2;
  
  // Aumentar el límite para mostrar más sugerencias
  const { data: apiResults, isLoading } = useSearchCities({
    q: query, // Usar query directo en lugar de debouncedQuery
    limit: 20, // Aumentado de 5 a 20 sugerencias
  });

  // Limpiar cache cuando cambia la query para forzar nueva búsqueda
  useEffect(() => {
    if (shouldSearchAPI) {
      // Limpiar cache específico para esta query usando la nueva serialización
      // TODO: Implementar constante para el número de sugerencias y aplicarlo a toda la aplicación
      const oldParams = { q: query, limit: 15 };
      const serializedOldParams = serializeParams(oldParams);
      const oldQueryKey = ['search', 'search', serializedOldParams];
      
      queryClient.removeQueries({
        queryKey: oldQueryKey,
      });
    }
  }, [query, shouldSearchAPI, queryClient]);

  const suggestions = apiResults || [];

  const source = 'api';

  return {
    suggestions,
    source,
    isLoading: shouldSearchAPI ? isLoading : false,
    hasHistory: false,
    hasApiResults: (apiResults?.length || 0) > 0,
  };
}; 