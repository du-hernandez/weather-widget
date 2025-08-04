// Utilidades compartidas

// Exportar constantes
export * from './constants';

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

/**
 * Limpia el nombre de una ciudad para la API del clima
 * - Elimina preposiciones y artículos
 * - Limita a máximo dos palabras
 * - Mantiene el formato city,countryCode
 */
export const cleanCityNameForWeatherAPI = (cityName: string, countryCode: string): string => {
  // Lista de palabras a eliminar (preposiciones, artículos, etc.)
  const wordsToRemove = [
    'de', 'del', 'la', 'las', 'el', 'los', 'da', 'das', 'do', 'dos',
    'di', 'du', 'van', 'von', 'der', 'den', 'dem', 'des', 'le', 'les',
    'of', 'the', 'and', 'y', 'e', 'o', 'ou', 'et', 'und', 'och', 'perímetro', 'perimetro', 'urbano'
  ];

  // Dividir el nombre en palabras y filtrar las que no están en la lista de eliminación
  const words = cityName
    .split(' ')
    .filter(word => !wordsToRemove.includes(word.toLowerCase()))
    .slice(0, 2); // Tomar solo las primeras dos palabras

  // Unir las palabras y agregar el código de país
  const cleanedCityName = words.join(' ');
  
  return `${cleanedCityName},${countryCode}`;
}; 