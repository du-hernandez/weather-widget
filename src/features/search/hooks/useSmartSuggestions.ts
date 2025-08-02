import { useAppSelector } from '@shared/hooks/redux';
import { useDebounce } from '@shared/hooks/useDebounce';
import { useSearchCities } from './useSearch';
import { selectRecentSearchHistory } from '../store/selectors';


/**
 * Hook para sugerencias inteligentes con prioridad de historial
 * @param query - Query de búsqueda
 * @returns Sugerencias y fuente de datos
 */
export const useSmartSuggestions = (query: string) => {
    // TODO: Implementar constante para el delay de debounce y aplicarlo a toda la aplicación
  const debouncedQuery = useDebounce(query, 500);
  const recentHistory = useAppSelector(selectRecentSearchHistory);
  
  // Solo buscar en API si no hay historial reciente y hay query
  const shouldSearchAPI = recentHistory.length === 0 && debouncedQuery.length >= 2;
  
  const { data: apiResults, isLoading } = useSearchCities({
    q: debouncedQuery,
    limit: 5,
  });

  // Determinar sugerencias y fuente
  const suggestions = recentHistory.length > 0 
  // TODO: Implementar constante para el número de sugerencias y aplicarlo a toda la aplicación
    ? recentHistory.slice(0, 5) // Máximo 5 del historial
    : apiResults || [];

  const source = recentHistory.length > 0 ? 'history' : 'api';

  return {
    suggestions,
    source,
    isLoading: shouldSearchAPI ? isLoading : false,
    hasHistory: recentHistory.length > 0,
    hasApiResults: (apiResults?.length || 0) > 0,
  };
}; 