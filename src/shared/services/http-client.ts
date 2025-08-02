import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import errorHandler from './error-handler';

// Cliente HTTP base usando Axios
class HttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para agregar API key a todas las requests
    this.client.interceptors.request.use((config) => {
      const apiKey = import.meta.env.VITE_API_KEY;
      if (apiKey) {
        config.params = {
          ...config.params,
          appid: apiKey,
        };
      }
      return config;
    });

    // Interceptor para manejar errores con mensajes amigables
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        // Usar el manejador de errores centralizado
        const appError = errorHandler.handleError(error);
        
        // Log del error original para debugging
        console.error('API Error:', {
          type: appError.type,
          message: appError.message,
          statusCode: appError.statusCode,
          originalError: error,
        });

        // Rechazar con el error procesado
        return Promise.reject({
          ...error,
          appError, // Agregar el error procesado
        });
      }
    );
  }

  public get<T>(url: string, params?: Record<string, any>): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, { params });
  }

  public post<T>(url: string, data?: any, params?: Record<string, any>): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, { params });
  }

  /**
   * Método helper para obtener mensaje de error amigable
   */
  public getErrorMessage(error: any): string {
    return errorHandler.getErrorMessage(error);
  }

  /**
   * Método helper para obtener tipo de error
   */
  public getErrorType(error: any): string {
    return errorHandler.getErrorType(error);
  }
}

// Instancia singleton del cliente HTTP
const httpClient = new HttpClient();
export default httpClient; 