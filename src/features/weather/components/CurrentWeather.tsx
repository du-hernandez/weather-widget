import React from 'react';
import { Card, Row, Col, Typography, Space, Tag, Divider } from 'antd';
import { 
  EnvironmentOutlined, 
  CloudOutlined,
  EyeOutlined,
  CompressOutlined
} from '@ant-design/icons';
import { useAppSelector } from '@shared/hooks/redux';
import { 
  selectCurrentWeather, 
  selectUnits, 
  selectWeatherDescription,
  selectWeatherIcon,
  selectTemperature
} from '../store/selectors';
import { getWeatherIcon, formatTemperature, formatWindSpeed, capitalizeWords } from '@shared/utils';

const { Title, Text } = Typography;

const CurrentWeather: React.FC = () => {
  const currentWeather = useAppSelector(selectCurrentWeather);
  const units = useAppSelector(selectUnits);
  const description = useAppSelector(selectWeatherDescription);
  const iconCode = useAppSelector(selectWeatherIcon);
  const temperature = useAppSelector(selectTemperature);

  if (!currentWeather) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Text type="secondary">Selecciona una ciudad para ver el clima</Text>
        </div>
      </Card>
    );
  }

  const weatherIcon = getWeatherIcon(iconCode);
  const formattedDescription = capitalizeWords(description);

  return (
    <Card title="Clima Actual" style={{ marginBottom: 16 }}>
      <Row gutter={[16, 16]}>
        {/* Ciudad y descripción */}
        <Col span={24}>
          <Space align="center">
            <EnvironmentOutlined />
            <Title level={4} style={{ margin: 0 }}>
              {currentWeather.name}, {currentWeather.sys.country}
            </Title>
          </Space>
          <div style={{ marginTop: 8 }}>
            <Space>
              <img 
                src={weatherIcon} 
                alt={formattedDescription}
                style={{ width: 50, height: 50 }}
              />
              <Text strong>{formattedDescription}</Text>
            </Space>
          </div>
        </Col>

        <Divider />

        {/* Temperatura principal */}
        <Col span={24}>
          <div style={{ textAlign: 'center' }}>
            <Title level={1} style={{ margin: 0, color: '#1890ff' }}>
              {temperature && formatTemperature(temperature.current, units)}
            </Title>
            <Text type="secondary">
              Sensación térmica: {temperature && formatTemperature(temperature.feelsLike, units)}
            </Text>
          </div>
        </Col>

        <Divider />

        {/* Detalles del clima */}
        <Col span={12}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text>Mín: {temperature && formatTemperature(temperature.min, units)}</Text>
            </div>
            <div>
              <Text>Máx: {temperature && formatTemperature(temperature.max, units)}</Text>
            </div>
            <div>
              <CloudOutlined style={{ marginRight: 8 }} />
              <Text>Humedad: {currentWeather.main.humidity}%</Text>
            </div>
          </Space>
        </Col>

        <Col span={12}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <Text>Viento: {formatWindSpeed(currentWeather.wind.speed, units)}</Text>
            </div>
            <div>
              <EyeOutlined style={{ marginRight: 8 }} />
              <Text>Visibilidad: {(currentWeather.visibility / 1000).toFixed(1)} km</Text>
            </div>
            <div>
              <CompressOutlined style={{ marginRight: 8 }} />
              <Text>Presión: {currentWeather.main.pressure} hPa</Text>
            </div>
          </Space>
        </Col>

        {/* Información adicional */}
        <Col span={24}>
          <div style={{ marginTop: 16 }}>
            <Space wrap>
              <Tag color="blue">Nubes: {currentWeather.clouds.all}%</Tag>
              <Tag color="green">ID: {currentWeather.weather[0].id}</Tag>
              <Tag color="orange">Zona horaria: UTC+{currentWeather.timezone / 3600}</Tag>
            </Space>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default CurrentWeather; 