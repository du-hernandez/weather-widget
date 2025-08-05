import React from 'react';
import CurrentWeather from '@features/weather/components/CurrentWeather';
import ProgressBarWrapper from '@app/components/ProgressBarWrapper';

interface WeatherSectionProps {
  lastUpdateTime: Date | null;
  hasInitialData: boolean;
}

const WeatherSection: React.FC<WeatherSectionProps> = ({
  lastUpdateTime,
  hasInitialData,
}) => {
  return (
    <>
      {/* Barra de progreso optimizada - Grid Area: progress */}
      <ProgressBarWrapper 
        lastUpdateTime={lastUpdateTime}
        hasInitialData={hasInitialData}
      />

      {/* Panel del clima - Grid Area: weather */}
      <div style={{ gridArea: 'weather' }}>
        <CurrentWeather />
      </div>
    </>
  );
};

export default WeatherSection; 