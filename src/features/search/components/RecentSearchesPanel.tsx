import React, { useMemo } from 'react';
import { ClockCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@shared/hooks/redux';
import { selectSearchHistory } from '../store/selectors';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import type { SearchResult } from '../types';
import { useMapState } from '@/features/map/hooks/useMapState';
import { MAP_CONSTANTS } from '@/shared/utils';
import { setSelectedLocation } from '@/features/map/store/mapSlice';

interface RecentSearchesPanelProps {
  onSelectSearch?: (city: SearchResult) => void;
  onClearHistory?: () => void;
}

const RecentSearchesPanel: React.FC<RecentSearchesPanelProps> = ({
  onSelectSearch,
  onClearHistory,
}) => {
  const searchHistory = useAppSelector(selectSearchHistory);
  const { updateCenter, updateZoom } = useMapState();
  const dispatch = useAppDispatch();

  // Organizar historial de forma ascendente (más recientes primero)
  const sortedHistory = useMemo(() => {
    return [...searchHistory].sort((a, b) => b.timestamp - a.timestamp);
  }, [searchHistory]);

  const handleHistoryItemClick = (city: SearchResult) => {
    if (onSelectSearch) {
      onSelectSearch(city);
      // Establece icono de ubicación en el mapa
      dispatch(setSelectedLocation({
        lat: city.lat,
        lng: city.lon,
        city: city.name,
        country: city.country,
        timestamp: Date.now(),
      }));

      updateCenter([city.lat, city.lon]);
      updateZoom(MAP_CONSTANTS.DEFAULT_ZOOM);
    }
  };

  const handleClearHistory = () => {
    console.log('🔄 Llamando a onClearHistory');
    if (onClearHistory) {
      onClearHistory();
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return formatDistanceToNow(timestamp, { 
      addSuffix: true, 
      locale: es 
    });
  };

  return (
    <div className="recent-searches-panel">
      <div className="recent-searches-header">
        <h3 className="recent-searches-title">
          Búsquedas recientes
        </h3>
        {sortedHistory.length > 0 && (
          <button 
            className="clear-history-button"
            onClick={handleClearHistory}
            title="Limpiar historial"
          >
            <DeleteOutlined />
          </button>
        )}
      </div>

      <div className="recent-searches-list">
        {sortedHistory.length === 0 ? (
          <div className="empty-history">
            <p>No hay búsquedas recientes</p>
          </div>
        ) : (
          <div className="history-items-container">
            {sortedHistory.map((item) => {

              const city: SearchResult = {
                name: item.city,
                lat: item.coordinates.lat,
                lon: item.coordinates.lon,
                country: item.country}

              return (
                <div
                  key={item.id}
                  className="history-item"
                  onClick={() => handleHistoryItemClick(city)}
                >
                  <div className="history-item-icon">
                    <ClockCircleOutlined />
                  </div>
                  <div className="history-item-content">
                    <div className="history-item-city">
                      {item.city}
                    </div>
                    <div className="history-item-details">
                      <span className="history-item-country">{item.country}</span>
                      <span className="history-item-time">
                        {formatTimestamp(item.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentSearchesPanel; 