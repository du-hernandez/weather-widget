import httpClient from '@shared/services/http-client';
import type { WeatherData, ForecastData } from '../types';

export interface WeatherApiParams {
  q?: string;
  lat?: number;
  lon?: number;
  units?: 'metric' | 'imperial';
}

export interface ForecastApiParams {
  q?: string;
  lat?: number;
  lon?: number;
  units?: 'metric' | 'imperial';
}

class WeatherApiService {
  /**
   * Obtiene el clima actual de una ciudad
   */
  async getCurrentWeather(params: WeatherApiParams): Promise<WeatherData> {
    const response = await httpClient.get<WeatherData>('/weather', {
      ...params,
      units: params.units || 'metric',
    });
    return response.data;
  }

  /**
   * Obtiene el pronóstico de 5 días para una ciudad
   */
  async getForecast(params: ForecastApiParams): Promise<ForecastData> {
    const response = await httpClient.get<ForecastData>('/forecast', {
      ...params,
      units: params.units || 'metric',
    });
    return response.data;
  }

  /**
   * Obtiene clima actual y pronóstico en paralelo
   */
  async getWeatherAndForecast(params: WeatherApiParams) {
    const [currentWeather, forecast] = await Promise.all([
      this.getCurrentWeather(params),
      this.getForecast(params),
    ]);

    return {
      currentWeather,
      forecast,
    };
  }
}

export const weatherApiService = new WeatherApiService();
export default weatherApiService; 