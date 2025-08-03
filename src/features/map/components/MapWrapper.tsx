import React from 'react';
import { Button, Card, Space, Typography } from 'antd';
import { ClearOutlined, AimOutlined } from '@ant-design/icons';
import { MapComponent } from './MapComponent';
import { useMapState } from '../hooks/useMapState';
import { useMapSelection } from '../hooks/useMapSelection';

const { Text, Title } = Typography;

/**
 * Componente wrapper que integra el mapa con controles
 */
export const MapWrapper: React.FC = () => {
  const { selectedLocation, hasSelectedLocation, coordinates } = useMapState();
  const { clearSelection } = useMapSelection();

  const handleClearSelection = () => {
    clearSelection();
  };

  const handleCenterOnUser = () => {
    // Función para centrar en la ubicación del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Aquí podrías implementar la lógica para centrar el mapa
          console.log('Ubicación del usuario:', { latitude, longitude });
        },
        (error) => {
          console.error('Error al obtener ubicación:', error);
        }
      );
    }
  };

  return (
    <div className="map-wrapper-container">
      {/* Header con efecto glass */}
      <div className="glass-effect map-header">
        <div className="map-header-content">
          <div className="map-header-title">
            <AimOutlined className="map-icon" />
            <h3 className="text-shadow">Selecciona una ubicación</h3>
          </div>
          <div className="map-header-actions">
            <Button 
              icon={<AimOutlined />} 
              onClick={handleCenterOnUser}
              size="small"
              className="map-action-btn"
            >
              Mi ubicación
            </Button>
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
      {selectedLocation && (
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
      )}
    </div>
  );
}; 