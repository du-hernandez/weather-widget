import React, { useCallback } from 'react';
import { Button, Card, Space, Typography, message } from 'antd';
import { ClearOutlined, AimOutlined } from '@ant-design/icons';
import { MapComponent } from './MapComponent';
import { useMapState } from '../hooks/useMapState';
import { useMapSelection } from '../hooks/useMapSelection';
import { useGeolocation } from '@shared/hooks/useGeolocation';

const { Text, Title } = Typography;

/**
 * Componente wrapper que integra el mapa con controles
 */
export const MapWrapper: React.FC = () => {
  const { selectedLocation, hasSelectedLocation, updateCenter, updateZoom } = useMapState();
  const { clearSelection, handleMapClick } = useMapSelection();
  const { getCurrentLocation, isSupported, isLoading: geolocationLoading } = useGeolocation();
  const [messageApi, contextHolder] = message.useMessage();

  const handleClearSelection = () => {
    clearSelection();
  };

  const handleCenterOnUser = useCallback(async () => {
    try {
      // Verificar si la geolocalización está soportada
      if (!isSupported()) {
        messageApi.error('Geolocalización no soportada por este navegador');
        return;
      }

      // Obtener la ubicación actual del usuario
      const position = await getCurrentLocation();
      
      // Centrar el mapa en la ubicación del usuario
      updateCenter([position.latitude, position.longitude]);
      updateZoom(12); // Zoom más cercano para mostrar detalles
      
      // Seleccionar automáticamente la ubicación del usuario
      await handleMapClick(position.latitude, position.longitude);
      
      messageApi.success('Ubicación actual centrada en el mapa');
      
    } catch (error) {
      console.error('Error al obtener ubicación del usuario:', error);
      messageApi.error('No se pudo obtener tu ubicación actual');
    }
  }, [isSupported, getCurrentLocation, updateCenter, updateZoom, handleMapClick, messageApi]);

  return (
    <>
      {contextHolder}
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
              loading={geolocationLoading}
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
    </>
  );
}; 