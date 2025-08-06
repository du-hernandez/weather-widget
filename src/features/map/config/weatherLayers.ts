import type { WeatherLayer } from '../types/layers';

/**
 * Configuración de capas meteorológicas de OpenWeatherMap
 * 
 * Cada capa proporciona datos específicos superpuestos sobre el mapa base:
 * - Precipitación: Lluvia/nieve en tiempo real
 * - Temperatura: Gradientes de temperatura
 * - Nubes: Cobertura de nubes
 * - Viento: Velocidad y dirección del viento
 */

const API_KEY = import.meta.env.VITE_API_KEY;

export const WEATHER_LAYERS: Record<string, WeatherLayer> = {
  // Capas topográficas (no meteorológicas, pero útiles para contexto)
  contours: {
    id: 'contours',
    name: 'Líneas de Altura',
    url: `https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png`,
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors, SRTM',
    opacity: 0.7,
    visible: false,
    zIndex: 5, // Debajo de capas meteorológicas
    description: 'Líneas de contorno topográficas y relieve del terreno'
  },
  
  // Capas meteorológicas de OpenWeatherMap
  precipitation: {
    id: 'precipitation',
    name: 'Precipitación',
    url: `https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
    attribution: '&copy; OpenWeatherMap',
    opacity: 0.6,
    visible: false,
    zIndex: 10,
    description: 'Muestra lluvia y nieve en tiempo real'
  },
  temperature: {
    id: 'temperature', 
    name: 'Temperatura',
    url: `https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
    attribution: '&copy; OpenWeatherMap',
    opacity: 0.7,
    visible: false,
    zIndex: 11,
    description: 'Gradientes de temperatura por colores'
  },
  clouds: {
    id: 'clouds',
    name: 'Nubes',
    url: `https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
    attribution: '&copy; OpenWeatherMap', 
    opacity: 0.5,
    visible: false,
    zIndex: 12,
    description: 'Cobertura de nubes'
  },
  wind: {
    id: 'wind',
    name: 'Viento',
    url: `https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
    attribution: '&copy; OpenWeatherMap',
    opacity: 0.6,
    visible: false,
    zIndex: 13,
    description: 'Velocidad y dirección del viento'
  },
  pressure: {
    id: 'pressure',
    name: 'Presión Atmosférica',
    url: `https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${API_KEY}`,
    attribution: '&copy; OpenWeatherMap',
    opacity: 0.6,
    visible: false,
    zIndex: 14,
    description: 'Presión atmosférica a nivel del mar'
  }
};

export const DEFAULT_LAYERS = Object.values(WEATHER_LAYERS);