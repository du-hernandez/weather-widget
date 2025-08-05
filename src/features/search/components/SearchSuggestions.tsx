import React, { useEffect, useState, useRef } from 'react';
import { EnvironmentOutlined, GlobalOutlined } from '@ant-design/icons';
import { useSmartSuggestions } from '../hooks/useSmartSuggestions';
import { useHistoryManagement } from '../hooks/useHistoryManagement';
import type { SearchResult } from '../types';

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
  const [overlayStyle, setOverlayStyle] = useState<React.CSSProperties>({});
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visible) {
      // Buscar el contenedor de búsqueda en el DOM
      const searchContainer = document.querySelector('.search-panel');
      if (searchContainer) {
        const rect = searchContainer.getBoundingClientRect();
        
        setOverlayStyle({
          position: 'fixed',
          top: `${rect.bottom + 8}px`,
          left: `${rect.left}px`,
          width: `${rect.width}px`,
          zIndex: 999999, // Z-index extremadamente alto
        });
      }
    }
  }, [visible]);

  if (!visible || query.length < 2) {
    return null;
  }

  const handleSuggestionClick = (suggestion: SearchResult) => {
    addCityToHistory(suggestion);
    onSelectSuggestion(suggestion);
  };

  const handleMouseEnter = () => {
  };

  const handleMouseLeave = () => {
  };

  const renderSuggestionItem = (item: SearchResult, index: number) => {
    return (
      <div
        key={`${item.name}-${item.country}-${index}`}
        className="suggestion-item"
        onClick={() => handleSuggestionClick(item)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="suggestion-content">
          <div className="suggestion-avatar">
            <EnvironmentOutlined className="avatar-icon" />
          </div>
          <div className="suggestion-info">
            <div className="suggestion-name">
              {item.name}
              {item.state && ` (${item.state})`}
            </div>
            <div className="suggestion-location">
              <GlobalOutlined className="location-icon" />
              <span className="location-text">{item.country}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="search-suggestions-overlay" 
      style={overlayStyle}
      ref={suggestionsRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {hasApiResults && suggestions.length > 0 && (
        <>
          <div className="suggestions-header">
            <h4 className="suggestions-title">
              ¿Quisiste decir? ({suggestions.length} resultados)
            </h4>
          </div>
          <div className="suggestions-list">
            {suggestions.map((suggestion, index) => 
              renderSuggestionItem(suggestion, index)
            )}
          </div>
        </>
      )}

      {isLoading && (
        <div className="suggestions-loading">
          <div className="loading-text">Buscando ciudades...</div>
        </div>
      )}

      {!isLoading && suggestions.length === 0 && query.length >= 2 && (
        <div className="suggestions-empty">
          <div className="empty-text">
            No encontramos ciudades que coincidan con "{query}"
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;

 