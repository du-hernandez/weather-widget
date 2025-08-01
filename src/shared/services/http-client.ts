import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';

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

    // Interceptor para manejar errores
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  public get<T>(url: string, params?: Record<string, any>): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, { params });
  }

  public post<T>(url: string, data?: any, params?: Record<string, any>): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, { params });
  }
}

// Instancia singleton del cliente HTTP
const httpClient = new HttpClient();
export default httpClient; 