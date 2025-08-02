// Tipos de errores específicos
export const ErrorType = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  CITY_NOT_FOUND: 'CITY_NOT_FOUND',
  API_ERROR: 'API_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ErrorType = typeof ErrorType[keyof typeof ErrorType];

export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: any;
  statusCode?: number;
}

/**
 * Servicio centralizado para manejo de errores
 */
class ErrorHandlerService {
  /**
   * Convierte errores de red en mensajes amigables
   */
  handleNetworkError(error: any): AppError {
    if (error.code === 'NETWORK_ERROR' || error.message?.includes('Network Error')) {
      return {
        type: ErrorType.NETWORK_ERROR,
        message: 'Fallo en la conexión.',
        originalError: error,
      };
    }

    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return {
        type: ErrorType.NETWORK_ERROR,
        message: 'La conexión tardó demasiado.',
        originalError: error,
      };
    }

    return {
      type: ErrorType.NETWORK_ERROR,
      message: 'Error de conexión. Intenta nuevamente.',
      originalError: error,
    };
  }

  /**
   * Convierte errores de API en mensajes específicos
   */
  handleApiError(error: any): AppError {
    const statusCode = error.response?.status;
    const errorMessage = error.response?.data?.message;

    switch (statusCode) {
      case 404:
        return {
          type: ErrorType.CITY_NOT_FOUND,
          message: 'Ciudad no encontrada.',
          originalError: error,
          statusCode,
        };

      case 400:
        return {
          type: ErrorType.VALIDATION_ERROR,
          message: 'Datos de búsqueda inválidos. Verifica el nombre de la ciudad.',
          originalError: error,
          statusCode,
        };

      case 401:
        return {
          type: ErrorType.API_ERROR,
          message: 'Error de autenticación. Contacta al administrador.',
          originalError: error,
          statusCode,
        };

      case 500:
      case 502:
      case 503:
        return {
          type: ErrorType.API_ERROR,
          message: 'Error del servidor. Intenta nuevamente.',
          originalError: error,
          statusCode,
        };

      default:
        return {
          type: ErrorType.API_ERROR,
          message: errorMessage || 'Error inesperado. Intenta nuevamente.',
          originalError: error,
          statusCode,
        };
    }
  }

  /**
   * Maneja errores de validación
   */
  handleValidationError(error: any): AppError {
    return {
      type: ErrorType.VALIDATION_ERROR,
      message: 'Datos inválidos. Verifica la información ingresada.',
      originalError: error,
    };
  }

  /**
   * Método principal para manejar cualquier tipo de error
   */
  handleError(error: any): AppError {
    // Error de red
    if (!error.response) {
      return this.handleNetworkError(error);
    }

    // Error de API
    if (error.response) {
      return this.handleApiError(error);
    }

    // Error de validación
    if (error.name === 'ValidationError') {
      return this.handleValidationError(error);
    }

    // Error desconocido
    return {
      type: ErrorType.UNKNOWN_ERROR,
      message: 'Error inesperado. Intenta nuevamente.',
      originalError: error,
    };
  }

  /**
   * Obtiene un mensaje de error amigable
   */
  getErrorMessage(error: any): string {
    const appError = this.handleError(error);
    return appError.message;
  }

  /**
   * Obtiene el tipo de error
   */
  getErrorType(error: any): ErrorType {
    const appError = this.handleError(error);
    return appError.type;
  }
}

export const errorHandler = new ErrorHandlerService();
export default errorHandler; 