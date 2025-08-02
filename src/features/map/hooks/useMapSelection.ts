import { useAppDispatch } from '@shared/hooks/redux';
import { useCityByCoordinates } from '@features/search/hooks/useSearch';
import { setSelectedLocation, setLoading, setError } from '../store/mapSlice';
import { addToHistory } from '@features/search/store/searchSlice';
import { setSelectedCity } from '@features/weather/store/weatherSlice';
import type { SelectedLocation } from '../types';

/**
 * Hook para manejar la selección de ubicación en el mapa
 */
export const useMapSelection = () => {
  const dispatch = useAppDispatch();

  /**
   * Manejar click en el mapa
   */
  const handleMapClick = async (lat: number, lng: number) => {
    try {
      dispatch(setLoading(true));
      
      // Crear ubicación seleccionada
      const selectedLocation: SelectedLocation = {
        lat,
        lng,
        timestamp: Date.now(),
      };

      dispatch(setSelectedLocation(selectedLocation));

      // Buscar información de la ciudad por coordenadas
      const { data: cities } = await useCityByCoordinates({ lat, lon: lng });
      
      if (cities && cities.length > 0) {
        const city = cities[0];
        
        // Actualizar ubicación con información de la ciudad
        const locationWithCity: SelectedLocation = {
          ...selectedLocation,
          city: city.name,
          country: city.country,
        };

        dispatch(setSelectedLocation(locationWithCity));
        
        // Agregar al historial de búsquedas
        dispatch(addToHistory(city));
        
        // Actualizar la ciudad seleccionada para que useWeatherAndForecast se ejecute automáticamente
        const preciseSearch = `${city.name},${city.country}`;
        dispatch(setSelectedCity(preciseSearch));
      }

      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setError(error instanceof Error ? error.message : 'Error al seleccionar ubicación'));
      dispatch(setLoading(false));
    }
  };

  /**
   * Limpiar selección
   */
  const clearSelection = () => {
    dispatch(setSelectedLocation(null));
  };

  return {
    handleMapClick,
    clearSelection,
  };
}; 