import { useState, useCallback } from 'react';

interface GeolocationError {
  code: number;
  message: string;
}

/**
 * Hook para manejar la geolocalización del usuario
 */
export const useGeolocation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Obtener la ubicación actual del usuario
   */
  const getCurrentLocation = useCallback((): Promise<{ latitude: number; longitude: number; accuracy?: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const error: GeolocationError = {
          code: 0,
          message: 'Geolocalización no soportada por este navegador'
        };
        reject(error);
        return;
      }

      setIsLoading(true);
      setError(null);

      const successCallback = (position: GeolocationPosition) => {
        setIsLoading(false);
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      };

      const errorCallback = (error: GeolocationPositionError) => {
        setIsLoading(false);
        
        let errorMessage: string;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permiso denegado para acceder a la ubicación';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Información de ubicación no disponible';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tiempo de espera agotado para obtener la ubicación';
            break;
          default:
            errorMessage = 'Error desconocido al obtener la ubicación';
        }

        setError(errorMessage);
        reject({
          code: error.code,
          message: errorMessage
        });
      };

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0 // No usar cache para obtener ubicación fresca
      };

      navigator.geolocation.getCurrentPosition(
        successCallback,
        errorCallback,
        options
      );
    });
  }, []);

  /**
   * Verificar si la geolocalización está disponible
   */
  const isSupported = useCallback(() => {
    return 'geolocation' in navigator;
  }, []);

  return {
    getCurrentLocation,
    isSupported,
    isLoading,
    error,
    clearError: () => setError(null)
  };
}; 