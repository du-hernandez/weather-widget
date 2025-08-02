import { useEffect } from 'react';
import { message } from 'antd';
import type { ErrorType } from '@shared/services/error-handler';

/**
 * Hook para mostrar mensajes de error usando Ant Design message
 */
export const useErrorMessage = (error: string | null, errorType?: ErrorType) => {
  useEffect(() => {
    if (error) {
      // Determinar el tipo de mensaje basado en el errorType
      switch (errorType) {
        case 'CITY_NOT_FOUND':
          message.error(error);
          break;
        case 'NETWORK_ERROR':
          message.error(error);
          break;
        case 'API_ERROR':
          message.error(error);
          break;
        case 'VALIDATION_ERROR':
          message.warning(error);
          break;
        default:
          message.error(error);
          break;
      }
    }
  }, [error, errorType]);
};

/**
 * Hook para mostrar mensajes de éxito
 */
export const useSuccessMessage = (successMessage: string | null) => {
  useEffect(() => {
    if (successMessage) {
      message.success(successMessage);
    }
  }, [successMessage]);
};

/**
 * Hook para mostrar mensajes de información
 */
export const useInfoMessage = (infoMessage: string | null) => {
  useEffect(() => {
    if (infoMessage) {
      message.info(infoMessage);
    }
  }, [infoMessage]);
}; 