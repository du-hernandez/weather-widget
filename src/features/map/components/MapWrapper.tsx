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
    <Card 
      title={
        <Space>
          <AimOutlined />
          <Title level={4} style={{ margin: 0 }}>Selecciona una ubicación</Title>
        </Space>
      }
      extra={
        <Space>
          <Button 
            icon={<AimOutlined />} 
            onClick={handleCenterOnUser}
            size="small"
          >
            Mi ubicación
          </Button>
          {hasSelectedLocation && (
            <Button 
              icon={<ClearOutlined />} 
              onClick={handleClearSelection}
              size="small"
              danger
            >
              Limpiar
            </Button>
          )}
        </Space>
      }
      className="map-wrapper-card"
    >
      <MapComponent />
      
      {selectedLocation && (
        <div className="selected-location-info">
          <Space direction="vertical" style={{ width: '100%' }}>
            <Text strong>Ubicación seleccionada:</Text>
            <Text type="secondary">
              Latitud: {selectedLocation.lat.toFixed(4)}, 
              Longitud: {selectedLocation.lng.toFixed(4)}
            </Text>
            {selectedLocation.city && (
              <Text type="secondary">
                Ciudad: {selectedLocation.city}
                {selectedLocation.country && `, ${selectedLocation.country}`}
              </Text>
            )}
          </Space>
        </div>
      )}
    </Card>
  );
}; 