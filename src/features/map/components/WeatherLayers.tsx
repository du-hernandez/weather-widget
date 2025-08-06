import React from 'react';
import { TileLayer } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { selectVisibleLayers } from '../store/layersSelectors';

/**
 * Componente que renderiza las capas meteorológicas activas en el mapa
 * 
 * - Lee las capas visibles del estado de Redux (ya filtradas)
 * - Renderiza un TileLayer de React Leaflet por cada capa visible
 * - Aplica la configuración de opacidad y z-index de cada capa
 * 
 * Se integra dentro del MapContainer de Leaflet como un conjunto de overlays
 */

export const WeatherLayers: React.FC = () => {
  // Obtener directamente las capas visibles para evitar el hook en el map
  const visibleLayers = useSelector(selectVisibleLayers);
  
  return (
    <>
      {visibleLayers.map(layer => (
        <TileLayer
          key={layer.id}
          url={layer.url}
          attribution={layer.attribution}
          opacity={layer.opacity}
          zIndex={layer.zIndex}
          // Configuraciones adicionales para optimización
          updateWhenIdle={false}
          updateWhenZooming={true}
          keepBuffer={2}
        />
      ))}
    </>
  );
};