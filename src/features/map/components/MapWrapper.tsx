import React from 'react';
import { Button } from 'antd';
import { ClearOutlined } from '@ant-design/icons';
import { MapComponent } from './MapComponent';
import { useMapState } from '../hooks/useMapState';
import { useMapSelection } from '../hooks/useMapSelection';
import { LocationButton } from '@/app/components/LocationButton';


/**
 * Componente wrapper que integra el mapa con controles
 */
export const MapWrapper: React.FC = () => {
  const { hasSelectedLocation } = useMapState();
  const { clearSelection } = useMapSelection();

  const handleClearSelection = () => {
    clearSelection();
  };

  return (
    <div className="map-wrapper-container">
      {/* Header con efecto glass */}
      <div className="glass-effect map-header">
        <div className="map-header-content">
          <div className="map-header-title">
            <h3 className="text-shadow">Selecciona una ubicación</h3>
          </div>
          <div className="map-header-actions">
            <LocationButton 
              size="small"
              className="map-action-btn"
            />
            {hasSelectedLocation && (
              <Button 
                icon={<ClearOutlined />} 
                onClick={handleClearSelection}
                size="small"
                danger
                className="map-action-btn"
              >
                Limpiar
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Contenido del mapa */}
      <div className="map-content">
        <MapComponent />
      </div>
      
      {/* Información de ubicación seleccionada */}
      {/* {selectedLocation && (
        <div className="glass-effect selected-location-info">
          <div className="location-info-content">
            <Text strong className="location-info-title">Ubicación seleccionada:</Text>
            <div className="location-details">
              <Text type="secondary" className="location-coordinates">
                Latitud: {selectedLocation.lat.toFixed(4)}, 
                Longitud: {selectedLocation.lng.toFixed(4)}
              </Text>
              {selectedLocation.city && (
                <Text type="secondary" className="location-city">
                  Ciudad: {selectedLocation.city}
                  {selectedLocation.country && `, ${selectedLocation.country}`}
                </Text>
              )}
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}; 