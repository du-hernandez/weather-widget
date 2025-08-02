import React from 'react';
import { formatTemperature } from '@shared/utils';

interface WeatherMainProps {
  cityName: string;
  countryCode: string;
  temperature: {
    current: number;
    feelsLike: number;
    min: number;
    max: number;
  };
  units: 'metric' | 'imperial';
  description: string;
}

const WeatherMain: React.FC<WeatherMainProps> = ({ 
  cityName, 
  countryCode, 
  temperature, 
  units, 
  description 
}) => {
  return (
    <div className="weather-main">
      <div className="temperature-section">
        <h1 className="current-temperature">
          {formatTemperature(temperature.current, units)}
        </h1>
        <div className="city-info">
          <h4 className="city-name">{cityName}</h4>
          <div className="country-code">{countryCode}</div>
        </div>
      </div>
      <div className="weather-description">
        {description}
      </div>
    </div>
  );
};

export default WeatherMain; 