import { useAppSelector, useAppDispatch } from '@shared/hooks/redux';
import { 
  selectMapCenter, 
  selectMapZoom, 
  selectSelectedLocation,
  selectMapIsLoading,
  selectMapError,
  selectHasSelectedLocation,
  selectMapCoordinates,
  selectMapLocationInfo
} from '../store/selectors';
import { setCenter, setZoom, clearMap } from '../store/mapSlice';

/**
 * Hook para acceder al estado del mapa
 */
export const useMapState = () => {
  const dispatch = useAppDispatch();
  
  const center = useAppSelector(selectMapCenter);
  const zoom = useAppSelector(selectMapZoom);
  const selectedLocation = useAppSelector(selectSelectedLocation);
  const isLoading = useAppSelector(selectMapIsLoading);
  const error = useAppSelector(selectMapError);
  const hasSelectedLocation = useAppSelector(selectHasSelectedLocation);
  const coordinates = useAppSelector(selectMapCoordinates);
  const locationInfo = useAppSelector(selectMapLocationInfo);

  /**
   * Actualizar centro del mapa
   */
  const updateCenter = (newCenter: [number, number]) => {
    dispatch(setCenter(newCenter));
  };

  /**
   * Actualizar zoom del mapa
   */
  const updateZoom = (newZoom: number) => {
    dispatch(setZoom(newZoom));
  };

  /**
   * Limpiar mapa
   */
  const clearMapState = () => {
    dispatch(clearMap());
  };

  return {
    // Estado
    center,
    zoom,
    selectedLocation,
    isLoading,
    error,
    hasSelectedLocation,
    coordinates,
    locationInfo,
    
    // Acciones
    updateCenter,
    updateZoom,
    clearMapState,
  };
}; 