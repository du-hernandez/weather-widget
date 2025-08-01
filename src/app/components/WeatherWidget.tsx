import React from 'react';
import { useAppSelector } from '../../shared/hooks/redux';
import { selectSelectedCity, selectUnits } from '../../features/weather/store/selectors';

const WeatherWidget: React.FC = () => {
  const selectedCity = useAppSelector(selectSelectedCity);
  const units = useAppSelector(selectUnits);

  return (
    <div className="weather-widget">
      <h1>Weather Widget</h1>
      <div>
        <p>Ciudad seleccionada: {selectedCity || 'Ninguna'}</p>
        <p>Unidades: {units}</p>
      </div>
      {/* Aquí irán los componentes de weather y search */}
    </div>
  );
};

export default WeatherWidget; 