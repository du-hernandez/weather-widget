import { useCallback, useMemo } from 'react';
import { useAppSelector } from '@shared/hooks/redux';
import { selectSelectedCity, selectSelectedCoordinates } from '@features/weather/store/selectors';
import { useWeatherAndForecast } from '@features/weather/hooks/useWeather';
import { useLastUpdateTime } from '@shared/hooks/useLastUpdateTime';

interface UseWeatherCoordinationProps {
  onScrollToTopImmediate: () => void;
}

export const useWeatherCoordination = ({ onScrollToTopImmediate }: UseWeatherCoordinationProps) => {
  const selectedCity = useAppSelector(selectSelectedCity);
  const selectedCoordinates = useAppSelector(selectSelectedCoordinates);
  
  // Hook personalizado para manejar lastUpdateTime
  const { lastUpdateTime, hasInitialData, updateLastUpdateTime } = useLastUpdateTime();

  // Memoizar los parámetros del hook para evitar re-ejecuciones innecesarias
  const weatherParams = useMemo(() => {
    // Si tenemos coordenadas seleccionadas, usarlas
    if (selectedCoordinates) {
      return { lat: selectedCoordinates.lat, lon: selectedCoordinates.lon };
    }
    // Si tenemos ciudad seleccionada, usarla
    else if (selectedCity) {
      // Para más exactitud buscamos por coordenadas
      // El nombre de la ciudad puede estar repetido en un mismno país
      return { lat: selectedCity.lat, lon: selectedCity.lon };
    }
    // Si no hay nada seleccionado, retornar objeto vacío
    return {};
  }, [selectedCity, selectedCoordinates]);

  // Callback que se ejecuta cuando se completan los datos climáticos
  const handleWeatherDataLoaded = useCallback(() => {
    updateLastUpdateTime();
    // Auto-scroll inmediato a la parte superior
    onScrollToTopImmediate();
  }, [updateLastUpdateTime, onScrollToTopImmediate]);

  // Solo actualiza lastUpdateTime cuando se obtienen los datos exitosamente
  useWeatherAndForecast(
    weatherParams,
    handleWeatherDataLoaded
  );

  return {
    lastUpdateTime,
    hasInitialData,
  };
}; 