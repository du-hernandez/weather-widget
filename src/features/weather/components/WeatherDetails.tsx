import React from 'react';
import { CloudOutlined, EyeOutlined, ThunderboltOutlined, GlobalOutlined } from '@ant-design/icons';
import { formatTemperature, formatWindSpeed } from '@shared/utils';

interface WeatherDetailsProps {
  humidity: number;
  windSpeed: number;
  temperature: {
    current: number;
    feelsLike: number;
    min: number;
    max: number;
  };
  units: 'metric' | 'imperial';
  visibility: number;
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ 
  humidity, 
  windSpeed, 
  temperature, 
  units, 
  visibility 
}) => {
  return (
    <div className="weather-details">
      <div className="detail-item">
        <CloudOutlined className="detail-icon" />
        <div className="detail-content">
          <span className="detail-label">Humedad</span>
          <span className="detail-value">{humidity}%</span>
        </div>
      </div>

      <div className="detail-item">
        <GlobalOutlined className="detail-icon" />
        <div className="detail-content">
          <span className="detail-label">Velocidad del viento</span>
          <span className="detail-value">{formatWindSpeed(windSpeed, units)}</span>
        </div>
      </div>

      <div className="detail-item">
        <ThunderboltOutlined className="detail-icon" />
        <div className="detail-content">
          <span className="detail-label">Sensación térmica</span>
          <span className="detail-value">
            {formatTemperature(temperature.feelsLike, units)}
          </span>
        </div>
      </div>

      <div className="detail-item">
        <EyeOutlined className="detail-icon" />
        <div className="detail-content">
          <span className="detail-label">Visibilidad</span>
          <span className="detail-value">{(visibility / 1000).toFixed(1)} km</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetails; 