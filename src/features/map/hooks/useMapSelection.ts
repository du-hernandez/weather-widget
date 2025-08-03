import { useAppDispatch } from '@shared/hooks/redux';
import { useCityByCoordinates } from '@features/search/hooks/useSearch';
import { setSelectedLocation, setLoading, setError } from '../store/mapSlice';
import { addToHistory } from '@features/search/store/searchSlice';
import { setSelectedCity, setSelectedCoordinates } from '@features/weather/store/weatherSlice';
import { cleanCityNameForWeatherAPI } from '@shared/utils';
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

      // Usar coordenadas directamente para el clima
      dispatch(setSelectedCoordinates({ lat, lon: lng }));

      // Buscar información de la ciudad por coordenadas usando el servicio
      const searchApiService = (await import('@features/search/services/searchApi')).default;
      const cities = await searchApiService.getCityByCoordinates({ lat, lon: lng });
      
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