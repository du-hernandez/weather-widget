import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '@shared/hooks/redux';
import { 
  setLoading, 
  setError, 
  setSearchResults,
  addToHistory,
  clearSearch 
} from '../store/searchSlice';
import searchApiService from '../services/searchApi';
import type { SearchApiParams, ReverseGeocodingParams } from '../services/searchApi';
import type { SearchResult } from '../types';

// Query keys para cache
export const searchKeys = {
  all: ['search'] as const,
  cities: (params: SearchApiParams) => [...searchKeys.all, 'cities', params] as const,
  reverse: (params: ReverseGeocodingParams) => [...searchKeys.all, 'reverse', params] as const,
};

/**
 * Hook para buscar ciudades
 */
export const useSearchCities = (params: SearchApiParams) => {
  const dispatch = useAppDispatch();

  const query = useQuery({
    queryKey: searchKeys.cities(params),
    queryFn: () => searchApiService.searchCities(params),
    enabled: params.q.length >= 2, // Solo buscar si hay al menos 2 caracteres
  });

  // Efectos para manejar el estado de Redux
  useEffect(() => {
    if (query.data) {
      dispatch(setSearchResults(query.data));
    }
  }, [query.data, dispatch]);

  useEffect(() => {
    if (query.error) {
      dispatch(setError(query.error.message));
    }
  }, [query.error, dispatch]);

  useEffect(() => {
    dispatch(setLoading(query.isLoading));
  }, [query.isLoading, dispatch]);

  return query;
};

/**
 * Hook para obtener ciudad por coordenadas
 */
export const useCityByCoordinates = (params: ReverseGeocodingParams) => {
  const dispatch = useAppDispatch();

  const query = useQuery({
    queryKey: searchKeys.reverse(params),
    queryFn: () => searchApiService.getCityByCoordinates(params),
    enabled: !!(params.lat && params.lon),
  });

  // Efectos para manejar el estado de Redux
  useEffect(() => {
    if (query.data && query.data.length > 0) {
      dispatch(setSearchResults(query.data));
      // Agregar al historial automáticamente
      dispatch(addToHistory(query.data[0]));
    }
  }, [query.data, dispatch]);

  useEffect(() => {
    if (query.error) {
      dispatch(setError(query.error.message));
    }
  }, [query.error, dispatch]);

  useEffect(() => {
    dispatch(setLoading(query.isLoading));
  }, [query.isLoading, dispatch]);

  return query;
};

/**
 * Hook para agregar ciudad al historial
 */
export const useAddToHistory = () => {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (city: SearchResult) => Promise.resolve(city),
    onSuccess: (city: SearchResult) => {
      dispatch(addToHistory(city));
    },
  });
};

/**
 * Hook para limpiar cache de búsqueda
 */
export const useClearSearchCache = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: () => Promise.resolve(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: searchKeys.all });
      dispatch(clearSearch());
    },
  });
}; 