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
import type { AppError } from '@shared/services/error-handler';
import { createQueryKeyFactory } from '@shared/utils/query-keys';

// Extender el tipo Error para incluir appError
interface ExtendedError extends Error {
  appError?: AppError;
}

// Query keys para cache con serialización consistente
export const searchKeys = createQueryKeyFactory(['search']);

/**
 * Hook para buscar ciudades
 */
export const useSearchCities = (params: SearchApiParams) => {
  const dispatch = useAppDispatch();

  const query = useQuery({
    queryKey: searchKeys.search(params),
    queryFn: () => searchApiService.searchCities(params),
    enabled: params.q.length >= 2,
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });

  // Efectos para manejar el estado de Redux
  useEffect(() => {
    if (query.data) {
      dispatch(setSearchResults(query.data));
    }
  }, [query.data, dispatch]);

  useEffect(() => {
    if (query.error) {
      const extendedError = query.error as ExtendedError;
      const errorMessage = extendedError.appError?.message || query.error.message;
      dispatch(setError(errorMessage));
    }
  }, [query.error, dispatch]);

  useEffect(() => {
    dispatch(setLoading(query.isLoading));
  }, [query.isLoading, dispatch]);

  return query;
};

/**
 * Hook para obtener ciudad por coordenadas (reverse geocoding)
 */
export const useCityByCoordinates = (params: ReverseGeocodingParams) => {
  const dispatch = useAppDispatch();

  const query = useQuery({
    queryKey: searchKeys.custom('reverse', params),
    queryFn: () => searchApiService.getCityByCoordinates(params),
    enabled: !!(params.lat && params.lon),
  });

  // Efectos para manejar el estado de Redux
  useEffect(() => {
    if (query.data && query.data.length > 0) {
      dispatch(setSearchResults(query.data));
      dispatch(addToHistory(query.data[0]));
    }
  }, [query.data, dispatch]);

  useEffect(() => {
    if (query.error) {
      const extendedError = query.error as ExtendedError;
      const errorMessage = extendedError.appError?.message || query.error.message;
      dispatch(setError(errorMessage));
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