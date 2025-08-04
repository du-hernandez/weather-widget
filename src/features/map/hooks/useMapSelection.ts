import { useAppDispatch } from '@shared/hooks/redux';
import { setSelectedLocation, setLoading, setError } from '../store/mapSlice';
import { addToHistory } from '@features/search/store/searchSlice';
import { setSelectedCoordinates } from '@features/weather/store/weatherSlice';
import { useAutoScroll } from '@shared/hooks/useAutoScroll';
import type { SelectedLocation } from '../types';
import searchApiService from '@/shared/services/searchApi';

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
    console.log('Coordenadas del evento:', { lat, lng });


    try {
      dispatch(setLoading(true));

      // Crear ubicación seleccionada
      const selectedLocation: SelectedLocation = {
        lat,
        lng,
        timestamp: Date.now(),
      };

      // Usar coordenadas directamente para el clima
      dispatch(setSelectedCoordinates({ lat, lon: lng }));

      // Buscar información de la ciudad por coordenadas usando el servicio
      try {
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
      } catch (geocodingError) {
        // Si falla el geocoding, continuar con las coordenadas
        console.warn('Error en geocoding:', geocodingError);
      }

      dispatch(setLoading(false));
      // Auto-scroll a la parte superior después de completar la búsqueda
      scrollToTop(300);
    } catch (error) {
      console.error('Error en handleMapClick:', error);
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