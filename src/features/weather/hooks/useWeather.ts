import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppDispatch } from '@shared/hooks/redux';
import { 
  setLoading, 
  setError, 
  setCurrentWeather, 
  setForecast,
  setSelectedCity,
  clearWeather 
} from '../store/weatherSlice';
import weatherApiService, { type WeatherApiParams } from '../services/weatherApi';

// Query keys para cache
export const weatherKeys = {
  all: ['weather'] as const,
  current: (params: WeatherApiParams) => [...weatherKeys.all, 'current', params] as const,
  forecast: (params: WeatherApiParams) => [...weatherKeys.all, 'forecast', params] as const,
  combined: (params: WeatherApiParams) => [...weatherKeys.all, 'combined', params] as const,
};

/**
 * Hook para obtener el clima actual
 */
export const useCurrentWeather = (params: WeatherApiParams) => {
  const dispatch = useAppDispatch();

  const query = useQuery({
    queryKey: weatherKeys.current(params),
    queryFn: () => weatherApiService.getCurrentWeather(params),
    enabled: !!(params.q || (params.lat && params.lon)),
  });

  // Efectos para manejar el estado de Redux
  useEffect(() => {
    if (query.data) {
      dispatch(setCurrentWeather(query.data));
      dispatch(setSelectedCity(query.data.name));
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
 * Hook para obtener el pronóstico
 */
export const useForecast = (params: WeatherApiParams) => {
  const dispatch = useAppDispatch();

  const query = useQuery({
    queryKey: weatherKeys.forecast(params),
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
      dispatch(setError(query.error.message));
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
export const useWeatherAndForecast = (params: WeatherApiParams) => {
  const dispatch = useAppDispatch();

  const query = useQuery({
    queryKey: weatherKeys.combined(params),
    queryFn: () => weatherApiService.getWeatherAndForecast(params),
    enabled: !!(params.q || (params.lat && params.lon)),
  });

  // Efectos para manejar el estado de Redux
  useEffect(() => {
    if (query.data) {
      dispatch(setCurrentWeather(query.data.currentWeather));
      dispatch(setForecast(query.data.forecast));
      dispatch(setSelectedCity(query.data.currentWeather.name));
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