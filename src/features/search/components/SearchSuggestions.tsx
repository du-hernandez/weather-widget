import React from 'react';
import { List, Avatar, Space, Typography, Alert } from 'antd';
import { EnvironmentOutlined, GlobalOutlined } from '@ant-design/icons';
import { useSmartSuggestions } from '../hooks/useSmartSuggestions';
import { useHistoryManagement } from '../hooks/useHistoryManagement';
import type { SearchResult } from '../types';

const { Text, Title } = Typography;

interface SearchSuggestionsProps {
  query: string;
  onSelectSuggestion: (suggestion: SearchResult) => void;
  visible?: boolean;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  query,
  onSelectSuggestion,
  visible = true,
}) => {
  const { suggestions, isLoading, hasApiResults } = useSmartSuggestions(query);
  const { addCityToHistory } = useHistoryManagement();

  if (!visible) {
    return null;
  }

  // Mostrar mensaje cuando no hay resultados y no está cargando
  if (!isLoading && suggestions.length === 0 && query.length >= 2) {
    return (
      <div style={{ marginTop: 8 }}>
        <Alert
          // message="No se encontraron ciudades"
          description={`No encontramos ciudades.`}
          type="warning"
          showIcon
          style={{ borderRadius: 6 }}
        />
      </div>
    );
  }

  const handleSuggestionClick = (suggestion: SearchResult) => {
    addCityToHistory(suggestion);
    onSelectSuggestion(suggestion);
  };

  const renderSuggestionItem = (item: SearchResult, index: number) => {
    return (
      <List.Item
        key={`${item.name}-${item.country}-${index}`}
        onClick={() => handleSuggestionClick(item)}
        style={{ cursor: 'pointer', padding: '8px 16px' }}
      >
        <List.Item.Meta
          avatar={
            <Avatar 
              icon={<EnvironmentOutlined />}
              style={{ backgroundColor: '#52c41a' }}
            />
          }
          title={
            <Space>
              <Text strong>{item.name}</Text>
              {item.state && <Text type="secondary">({item.state})</Text>}
            </Space>
          }
          description={
            <Space>
              <GlobalOutlined />
              <Text type="secondary">{item.country}</Text>
            </Space>
          }
        />
      </List.Item>
    );
  };

  return (
    <div style={{ marginTop: 8 }}>
      {hasApiResults && (
        <>
          <Title level={5} style={{ margin: '8px 16px', color: '#52c41a' }}>
            ¿Quisiste decir?
          </Title>
          <List
            size="small"
            dataSource={suggestions as SearchResult[]}
            renderItem={renderSuggestionItem}
            style={{ backgroundColor: '#f6ffed', borderRadius: 6 }}
          />
        </>
      )}

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '16px' }}>
          <Text type="secondary">Buscando ciudades...</Text>
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;

 