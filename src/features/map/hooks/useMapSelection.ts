import { useAppDispatch } from '@shared/hooks/redux';
import { useCityByCoordinates } from '@features/search/hooks/useSearch';
import { setSelectedLocation, setLoading, setError } from '../store/mapSlice';
import { addToHistory } from '@features/search/store/searchSlice';
import { setSelectedCity, setSelectedCoordinates } from '@features/weather/store/weatherSlice';
import { cleanCityNameForWeatherAPI } from '@shared/utils';
import { useAutoScroll } from '@shared/hooks/useAutoScroll';
import type { SelectedLocation } from '../types';

/**
 * Hook para manejar la selección de ubicación en el mapa
 */
export const useMapSelection = () => {
  const dispatch = useAppDispatch();
  const { scrollToTop } = useAutoScroll();

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
        // TODO: Investigar por qué toma el primer elemento del array, será porque es el más probable?
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
      
      // Auto-scroll a la parte superior después de completar la búsqueda
      scrollToTop(300); // 300ms de delay para que se complete la actualización del UI
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