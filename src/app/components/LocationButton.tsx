import React, { useCallback } from 'react';
import { Button, message } from 'antd';
import { AimOutlined } from '@ant-design/icons';
import { useGeolocation } from '@shared/hooks/useGeolocation';
import { useMapState } from '@features/map/hooks/useMapState';
import { useMapSelection } from '@features/map/hooks/useMapSelection';

interface LocationButtonProps {
  size?: 'small' | 'middle' | 'large';
  className?: string;
  onLocationSelected?: (latitude: number, longitude: number) => void;
  showSuccessMessage?: boolean;
  showErrorMessage?: boolean;
}

/**
 * Componente compartido para el botón "Mi ubicación"
 */
export const LocationButton: React.FC<LocationButtonProps> = ({
  size = 'small',
  className = '',
  onLocationSelected,
  showSuccessMessage = true,
  showErrorMessage = true,
}) => {
  const { getCurrentLocation, isSupported, isLoading } = useGeolocation();
  const { updateCenter, updateZoom } = useMapState();
  const { handleMapClick } = useMapSelection();
  const [messageApi, contextHolder] = message.useMessage();

  const handleGetLocation = useCallback(async () => {
    try {
      // Verificar si la geolocalización está soportada
      if (!isSupported()) {
        if (showErrorMessage) {
          messageApi.error('Geolocalización no soportada por este navegador');
        }
        return;
      }

      // Obtener la ubicación actual del usuario
      const position = await getCurrentLocation();
      
      // Si se proporciona callback personalizado, usarlo
      if (onLocationSelected) {
        onLocationSelected(position.latitude, position.longitude);
      } else {
        // Comportamiento por defecto: centrar mapa y seleccionar ubicación
        updateCenter([position.latitude, position.longitude]);
        updateZoom(12);
        await handleMapClick(position.latitude, position.longitude);
      }
      
      if (showSuccessMessage) {
        messageApi.success('Ubicación actual obtenida');
      }
      
    } catch (error) {
      console.error('Error al obtener ubicación del usuario:', error);
      if (showErrorMessage) {
        messageApi.error('No se pudo obtener tu ubicación actual');
      }
    }
  }, [
    isSupported, 
    getCurrentLocation, 
    onLocationSelected, 
    updateCenter, 
    updateZoom, 
    handleMapClick, 
    messageApi, 
    showSuccessMessage, 
    showErrorMessage
  ]);

  return (
    <>
      {contextHolder}
      <Button
        icon={<AimOutlined />}
        onClick={handleGetLocation}
        loading={isLoading}
        size={size}
        className={className}
        title="Obtener mi ubicación actual"
      >
        Mi ubicación
      </Button>
    </>
  );
}; 