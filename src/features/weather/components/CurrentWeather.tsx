import React from 'react';
import { Typography } from 'antd';
import { useAppSelector } from '@shared/hooks/redux';
import { 
  selectCurrentWeather, 
  selectUnits, 
  selectWeatherDescription,
  selectWeatherIcon,
  selectTemperature
} from '../store/selectors';
import { capitalizeWords } from '@shared/utils';
import WeatherHeader from './WeatherHeader';
import WeatherMain from './WeatherMain';
import WeatherDetails from './WeatherDetails';

const { Text } = Typography;

const CurrentWeather: React.FC = () => {
  const currentWeather = useAppSelector(selectCurrentWeather);
  const units = useAppSelector(selectUnits);
  const description = useAppSelector(selectWeatherDescription);
  const iconCode = useAppSelector(selectWeatherIcon);
  const temperature = useAppSelector(selectTemperature);

  if (!currentWeather || !temperature) {
    return (
      <div className="weather-panel glass-effect">
        <div className="current-weather">
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <Text style={{ color: 'var(--text-secondary)' }}>
              Selecciona una ciudad para ver el clima
            </Text>
          </div>
        </div>
      </div>
    );
  }

  const formattedDescription = capitalizeWords(description);

  return (
    <div className="weather-panel glass-effect">
      <div className="current-weather">
        
        <WeatherHeader 
          iconCode={iconCode} 
          description={formattedDescription} 
        />

        <WeatherMain 
          cityName={currentWeather.name}
          countryCode={currentWeather.sys.country}
          temperature={temperature}
          units={units}
          description={formattedDescription}
        />

        <WeatherDetails 
          humidity={currentWeather.main.humidity}
          windSpeed={currentWeather.wind.speed}
          temperature={temperature}
          units={units}
          visibility={currentWeather.visibility}
        />


      </div>
    </div>
  );
};

export default CurrentWeather; 