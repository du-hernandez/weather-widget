import React from 'react';
import { getWeatherIcon } from '@shared/utils';

interface WeatherHeaderProps {
  iconCode: string;
  description: string;
}

const WeatherHeader: React.FC<WeatherHeaderProps> = ({ iconCode, description }) => {
  const weatherIcon = getWeatherIcon(iconCode);

  return (
    <div className="weather-header">
      <h3 className="weather-title">Current</h3>
      <img 
        src={weatherIcon} 
        alt={description}
        className="weather-icon"
      />
    </div>
  );
};

export default WeatherHeader; 