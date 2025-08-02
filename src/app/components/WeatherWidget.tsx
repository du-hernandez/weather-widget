import React from 'react';
import { useAppSelector } from '@shared/hooks/redux';
import { useLoading } from '@shared/hooks/useLoading';
import { selectSelectedCity, selectUnits } from '@features/weather/store/selectors';

const WeatherWidget: React.FC = () => {
  const selectedCity = useAppSelector(selectSelectedCity);
  const units = useAppSelector(selectUnits);
  const { isLoading, error } = useLoading();

  return (
    <div className="weather-widget">
      <h1>Weather Widget</h1>
      <div>
        <p>Ciudad seleccionada: {selectedCity || 'Ninguna'}</p>
        <p>Unidades: {units}</p>
        {isLoading && <p>🔄 Cargando...</p>}
        {error && <p>❌ Error: {error}</p>}
      </div>
      {/* Aquí irán los componentes de weather y search */}
    </div>
  );
};

export default WeatherWidget; 