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
      <div className="weather-icon-container">
        <img 
          src={weatherIcon} 
          alt={description}
          className="weather-icon"
          title={description}
        />
      </div>
    </div>
  );
};

export default WeatherHeader; 