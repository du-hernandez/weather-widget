import { useAppSelector } from './redux';
import { selectIsLoading as selectWeatherLoading, selectError as selectWeatherError } from '@features/weather/store/selectors';
import { selectSearchIsLoading, selectSearchError } from '@features/search/store/selectors';

/**
 * Hook para obtener el estado de carga general
 */
export const useLoading = () => {
  const weatherLoading = useAppSelector(selectWeatherLoading);
  const searchLoading = useAppSelector(selectSearchIsLoading);
  const weatherError = useAppSelector(selectWeatherError);
  const searchError = useAppSelector(selectSearchError);

  return {
    isLoading: weatherLoading || searchLoading,
    weatherLoading,
    searchLoading,
    error: weatherError || searchError,
    weatherError,
    searchError,
  };
};

/**
 * Hook para obtener solo el estado de carga del weather
 */
export const useWeatherLoading = () => {
  const isLoading = useAppSelector(selectWeatherLoading);
  const error = useAppSelector(selectWeatherError);

  return { isLoading, error };
};

/**
 * Hook para obtener solo el estado de carga del search
 */
export const useSearchLoading = () => {
  const isLoading = useAppSelector(selectSearchIsLoading);
  const error = useAppSelector(selectSearchError);

  return { isLoading, error };
}; 