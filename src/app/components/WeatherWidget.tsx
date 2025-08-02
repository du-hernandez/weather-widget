import React, { useState } from 'react';
import { Layout, Row, Col, Space, Alert } from 'antd';
import { useAppSelector } from '@shared/hooks/redux';
import { useLoading } from '@shared/hooks/useLoading';
import { selectSelectedCity, selectUnits } from '@features/weather/store/selectors';
import SearchBar from '@features/search/components/SearchBar';
import SearchSuggestions from '@features/search/components/SearchSuggestions';
import CurrentWeather from '@features/weather/components/CurrentWeather';
import { useWeatherAndForecast } from '@features/weather/hooks/useWeather';
import { useAppDispatch } from '@shared/hooks/redux';
import { setSelectedCity } from '@features/weather/store/weatherSlice';
import type { SearchResult } from '@features/search/types';

const { Content } = Layout;

const WeatherWidget: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedCity = useAppSelector(selectSelectedCity);
  const units = useAppSelector(selectUnits);
  const { isLoading, error } = useLoading();
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');

  // Hook para clima - se ejecuta automáticamente cuando selectedCity cambia
  useWeatherAndForecast({ q: selectedCity || '' });

  const handleSearch = (query: string) => {
    setCurrentQuery(query);
    setShowSuggestions(true);
  };

  const handleSelectSuggestion = (suggestion: SearchResult) => {
    // Actualizar la ciudad seleccionada en Redux
    dispatch(setSelectedCity(suggestion.name));
    
    setShowSuggestions(false);
    setCurrentQuery('');
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
      <Content style={{ padding: '24px' }}>
        <Row justify="center">
          <Col xs={24} sm={20} md={16} lg={12} xl={10}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              
              {/* Título */}
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <h1 style={{ color: '#1890ff', margin: 0 }}>🌤️ Weather Widget</h1>
                <p style={{ color: '#666', margin: '8px 0 0 0' }}>
                  Busca una ciudad para ver el clima actual
                </p>
              </div>

              {/* Barra de búsqueda */}
              <div style={{ position: 'relative' }}>
                <SearchBar
                  onSearch={handleSearch}
                  loading={isLoading}
                  placeholder="Buscar ciudad (ej: London, Madrid, Tokyo)..."
                />
                
                {/* Sugerencias */}
                {showSuggestions && currentQuery && (
                  <SearchSuggestions
                    query={currentQuery}
                    onSelectSuggestion={handleSelectSuggestion}
                    visible={showSuggestions}
                  />
                )}
              </div>

              {/* Error */}
              {error && (
                <Alert
                  message="Error"
                  description={error}
                  type="error"
                  showIcon
                  closable
                />
              )}

              {/* Información de estado */}
              {selectedCity && (
                <Alert
                  message={`Ciudad seleccionada: ${selectedCity}`}
                  description={`Unidades: ${units === 'metric' ? 'Métrico (°C)' : 'Imperial (°F)'}`}
                  type="info"
                  showIcon
                  closable
                />
              )}

              {/* Clima actual */}
              <CurrentWeather />

            </Space>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default WeatherWidget; 