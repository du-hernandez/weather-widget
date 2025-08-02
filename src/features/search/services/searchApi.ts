import httpClient from '@shared/services/http-client';
import type { SearchResult } from '../types';

export interface SearchApiParams {
  q: string;
  limit?: number;
}

export interface ReverseGeocodingParams {
  lat: number;
  lon: number;
  limit?: number;
}

class SearchApiService {
  /**
   * Busca ciudades por nombre
   */
  async searchCities(params: SearchApiParams): Promise<SearchResult[]> {
    // Usar el endpoint de geocoding directo con URL completa
    const response = await httpClient.get<SearchResult[]>('https://api.openweathermap.org/geo/1.0/direct', {
      q: params.q,
      limit: params.limit || 20, // Aumentado de 5 a 20 sugerencias por defecto
    });
    return response.data;
  }

  /**
   * Obtiene información de ciudad por coordenadas (reverse geocoding)
   */
  async getCityByCoordinates(params: ReverseGeocodingParams): Promise<SearchResult[]> {
    const response = await httpClient.get<SearchResult[]>('https://api.openweathermap.org/geo/1.0/reverse', {
      lat: params.lat,
      lon: params.lon,
      limit: params.limit || 1,
    });
    return response.data;
  }
}

export const searchApiService = new SearchApiService();
export default searchApiService; 