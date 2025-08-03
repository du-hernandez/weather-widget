import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useMapState } from '../hooks/useMapState';

/**
 * Componente que actualiza el mapa cuando cambian el centro o zoom en Redux
 */
export const MapUpdater: React.FC = () => {
  const map = useMap();
  const { center, zoom } = useMapState();

  useEffect(() => {
    if (map && center) {
      map.setView(center, zoom);
    }
  }, [map, center, zoom]);

  return null;
}; 