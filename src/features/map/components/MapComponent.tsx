import React, { useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import type { LeafletMouseEvent } from 'leaflet';
import { useMapSelection } from '../hooks/useMapSelection';
import { useMapState } from '../hooks/useMapState';
import 'leaflet/dist/leaflet.css';

// Fix para los iconos de Leaflet en React
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

/**
 * Componente interno para manejar eventos del mapa
 */
const MapEvents: React.FC = () => {
  const { handleMapClick } = useMapSelection();

  useMapEvents({
    click: useCallback((event: LeafletMouseEvent) => {
      const { lat, lng } = event.latlng;
      handleMapClick(lat, lng);
    }, [handleMapClick]),
  });

  return null;
};

/**
 * Componente principal del mapa
 */
export const MapComponent: React.FC = () => {
  const { center, zoom, selectedLocation, isLoading, error } = useMapState();

  // Crear marcador personalizado para la ubicación seleccionada
  const selectedMarker = useMemo(() => {
    if (!selectedLocation) return null;

    return (
      <Marker 
        position={[selectedLocation.lat, selectedLocation.lng]}
        icon={new Icon({
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        })}
      >
        <Popup>
          <div>
            <h4>Ubicación Seleccionada</h4>
            <p>Latitud: {selectedLocation.lat.toFixed(4)}</p>
            <p>Longitud: {selectedLocation.lng.toFixed(4)}</p>
            {selectedLocation.city && (
              <p>Ciudad: {selectedLocation.city}</p>
            )}
            {selectedLocation.country && (
              <p>País: {selectedLocation.country}</p>
            )}
          </div>
        </Popup>
      </Marker>
    );
  }, [selectedLocation]);

  return (
    <div className="map-container">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '400px', width: '100%' }}
        className="weather-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents />
        {selectedMarker}
      </MapContainer>
      
      {isLoading && (
        <div className="map-loading">
          <p>Cargando información de la ubicación...</p>
        </div>
      )}
      
      {error && (
        <div className="map-error">
          <p>Error: {error}</p>
        </div>
      )}
    </div>
  );
}; 