import { useAppSelector } from '@shared/hooks/redux';
import { useSearchCities } from './useSearch';
import { selectRecentSearchHistory } from '../store/selectors';


/**
 * Hook para sugerencias inteligentes con prioridad de historial
 * @param query - Query de búsqueda
 * @returns Sugerencias y fuente de datos
 */
export const useSmartSuggestions = (query: string) => {
  const recentHistory = useAppSelector(selectRecentSearchHistory);
  
  // Buscar en API si hay query válido (2+ caracteres)
  const shouldSearchAPI = query.length >= 2;
  
  // TODO: Implementar constante para el número de sugerencias y aplicarlo a toda la aplicación
  const { data: apiResults, isLoading } = useSearchCities({
    q: query, // Usar query directo en lugar de debouncedQuery
    limit: 5,
  });

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