import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '@shared/hooks/redux';
import { useAppSelector } from '@shared/hooks/redux';
import {
  setLoading,
  setError,
  setCurrentWeather,
  setForecast,
  setSelectedCity,
  clearWeather,
} from '../store/weatherSlice';
import { selectSelectedCity } from '../store/selectors';
import weatherApiService, { type WeatherApiParams } from '../services/weatherApi';
import type { AppError } from '@shared/services/error-handler';
import { createQueryKeyFactory } from '@shared/utils/query-keys';
import type { SearchResult } from '@/features/search/types';

// Extender el tipo Error para incluir appError
interface ExtendedError extends Error {
  appError?: AppError;
}

// Query keys para cache con serialización consistente
export const weatherKeys = createQueryKeyFactory(['weather']);

/**
 * Hook para obtener el clima actual
 */
export const useCurrentWeather = (params: WeatherApiParams) => {
  const dispatch = useAppDispatch();
  const currentSelectedCity = useAppSelector(selectSelectedCity);

  const query = useQuery({
    queryKey: weatherKeys.custom('current', params),
    queryFn: () => weatherApiService.getCurrentWeather(params),
    enabled: !!(params.q || (params.lat && params.lon)),
  });

  // Efectos para manejar el estado de Redux
  useEffect(() => {
    if (query.data) {
      dispatch(setCurrentWeather(query.data));

      // Solo actualizar selectedCity si es diferente o si no hay ciudad seleccionada
      // Esto evita que se actualice con solo el nombre cuando ya tenemos city,country
      // if (!currentSelectedCity || (params.q && params.q !== currentSelectedCity.name)) {
      if (!currentSelectedCity ||
        (params.lat && params.lat !== currentSelectedCity.lat &&
          params.lon && params.lon !== currentSelectedCity.lon)
      ) {
        const city: SearchResult = {
          name: query.data.name,
          lat: query.data.coord.lat,
          lon: query.data.coord.lon,
          country: query.data.sys.country,
        }
        dispatch(setSelectedCity(city));
      }
    }
  }, [query.data, dispatch, currentSelectedCity]);

  useEffect(() => {
    if (query.error) {
      // Usar el mensaje de error amigable del error procesado
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
 * Hook para obtener el pronóstico
 */
export const useForecast = (params: WeatherApiParams) => {
  const dispatch = useAppDispatch();

  const query = useQuery({
    queryKey: weatherKeys.custom('forecast', params),
    queryFn: () => weatherApiService.getForecast(params),
    enabled: !!(params.q || (params.lat && params.lon)),
  });

  // Efectos para manejar el estado de Redux
  useEffect(() => {
    if (query.data) {
      dispatch(setForecast(query.data));
    }
  }, [query.data, dispatch]);

  useEffect(() => {
    if (query.error) {
      // Usar el mensaje de error amigable del error procesado
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
 * Hook para obtener clima y pronóstico en paralelo
 */
export const useWeatherAndForecast = (
  params: WeatherApiParams,
  onSuccess?: () => void
) => {
  const dispatch = useAppDispatch();

  const query = useQuery({
    queryKey: weatherKeys.custom('combined', params),
    queryFn: () => weatherApiService.getWeatherAndForecast(params),
    enabled: !!(params.q && params.q.trim() !== '') || !!(params.lat && params.lon),
  });

  // Efectos para manejar el estado de Redux
  useEffect(() => {
    if (query.data) {
      dispatch(setCurrentWeather(query.data.currentWeather));
      dispatch(setForecast(query.data.forecast));

      // Ejecutar callback de éxito si está definido
      if (onSuccess) {
        onSuccess();
      }
    }
  }, [query.data, dispatch, onSuccess]);

  useEffect(() => {
    if (query.error) {
      // Usar el mensaje de error amigable del error procesado
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
 * Hook para limpiar el cache de weather
 */
export const useClearWeatherCache = () => {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: () => Promise.resolve(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: weatherKeys.all });
      dispatch(clearWeather());
    },
  });
}; 