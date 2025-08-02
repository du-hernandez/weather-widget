import { useDebounce } from '@shared/hooks/useDebounce';
import { useSearchCities } from './useSearch';
import type { SearchResult } from '../types';

/**
 * Hook para validación de ciudades y búsqueda exacta
 * @param query - Query de búsqueda
 * @returns Información de validación
 */
export const useCityValidation = (query: string) => {
  // TODO: Implementar constante para el delay de debounce y aplicarlo a toda la aplicación
  const debouncedQuery = useDebounce(query, 500);

  
  // Buscar en API si hay query
  const { data: apiResults, isLoading } = useSearchCities({
    q: debouncedQuery,
    limit: 10,
  });

  /**
   * Verificar si hay coincidencia exacta
   */
  const hasExactMatch = (cityName: string): boolean => {
    const normalizedQuery = query.toLowerCase().trim();
    const normalizedCity = cityName.toLowerCase().trim();
    return normalizedCity === normalizedQuery;
  };

  /**
   * Obtener coincidencia exacta de los resultados
   */
  const getExactMatch = (): SearchResult | null => {
    if (!apiResults) return null;
    
    return apiResults.find(result => hasExactMatch(result.name)) || null;
  };

  /**
   * Obtener sugerencias (sin coincidencia exacta)
   */
  const getSuggestions = (): SearchResult[] => {
    if (!apiResults) return [];
    
    return apiResults.filter(result => !hasExactMatch(result.name));
  };

  /**
   * Verificar si se debe mostrar "Did You Mean"
   */
  const shouldShowDidYouMean = (): boolean => {
    const exactMatch = getExactMatch();
    const suggestions = getSuggestions();
    
    return !exactMatch && suggestions.length > 0;
  };

  return {
    hasExactMatch,
    getExactMatch,
    getSuggestions,
    shouldShowDidYouMean,
    isLoading,
    totalResults: apiResults?.length || 0,
    exactMatch: getExactMatch(),
    suggestions: getSuggestions(),
  };
}; 