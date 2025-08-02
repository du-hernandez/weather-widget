import React from 'react';

interface WeatherIconInfoProps {
  iconCode: string;
}

const WeatherIconInfo: React.FC<WeatherIconInfoProps> = ({ iconCode }) => {
  // Función para obtener información adicional basada en el código del icono
  const getWeatherInfo = (code: string) => {
    const weatherInfo: { [key: string]: { type: string; color: string; description: string } } = {
      '01d': { type: 'sunny', color: '#FFD700', description: 'Cielo despejado' },
      '01n': { type: 'clear-night', color: '#4A90E2', description: 'Noche despejada' },
      '02d': { type: 'partly-cloudy-day', color: '#87CEEB', description: 'Pocas nubes' },
      '02n': { type: 'partly-cloudy-night', color: '#4A90E2', description: 'Noche con pocas nubes' },
      '03d': { type: 'cloudy', color: '#B0C4DE', description: 'Nubes dispersas' },
      '03n': { type: 'cloudy', color: '#4A90E2', description: 'Nubes dispersas' },
      '04d': { type: 'cloudy', color: '#B0C4DE', description: 'Nubes rotas' },
      '04n': { type: 'cloudy', color: '#4A90E2', description: 'Nubes rotas' },
      '09d': { type: 'rain', color: '#4682B4', description: 'Lluvia ligera' },
      '09n': { type: 'rain', color: '#4682B4', description: 'Lluvia ligera' },
      '10d': { type: 'rain', color: '#4682B4', description: 'Lluvia' },
      '10n': { type: 'rain', color: '#4682B4', description: 'Lluvia' },
      '11d': { type: 'thunderstorm', color: '#FF4500', description: 'Tormenta' },
      '11n': { type: 'thunderstorm', color: '#FF4500', description: 'Tormenta' },
      '13d': { type: 'snow', color: '#F0F8FF', description: 'Nieve' },
      '13n': { type: 'snow', color: '#F0F8FF', description: 'Nieve' },
      '50d': { type: 'fog', color: '#D3D3D3', description: 'Niebla' },
      '50n': { type: 'fog', color: '#D3D3D3', description: 'Niebla' }
    };

    return weatherInfo[code] || { type: 'unknown', color: '#808080', description: 'Desconocido' };
  };

  const weatherInfo = getWeatherInfo(iconCode);

  return (
    <div className="weather-icon-info" style={{ color: weatherInfo.color }}>
      <div className="weather-type">{weatherInfo.type}</div>
      <div className="weather-description">{weatherInfo.description}</div>
    </div>
  );
};

export default WeatherIconInfo; 