// Utilidades compartidas

/**
 * Formatea la temperatura según las unidades
 */
export const formatTemperature = (temp: number, unit: 'metric' | 'imperial' = 'metric'): string => {
  const symbol = unit === 'metric' ? '°C' : '°F';
  return `${Math.round(temp)}${symbol}`;
};

/**
 * Formatea la velocidad del viento
 */
export const formatWindSpeed = (speed: number, unit: 'metric' | 'imperial' = 'metric'): string => {
  const unitText = unit === 'metric' ? 'm/s' : 'mph';
  return `${speed.toFixed(1)} ${unitText}`;
};

/**
 * Obtiene el icono del clima basado en el código de OpenWeather
 */
export const getWeatherIcon = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

/**
 * Capitaliza la primera letra de cada palabra
 */
export const capitalizeWords = (text: string): string => {
  return text
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Valida si una coordenada es válida
 */
export const isValidCoordinate = (lat: number, lon: number): boolean => {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}; 