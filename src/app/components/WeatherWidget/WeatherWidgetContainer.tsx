import React from 'react';
import { useScrollToTop } from '@/shared/hooks/useAutoScroll';
import { useSearchManagement } from './hooks/useSearchManagement';
import { useHistoryManagement } from './hooks/useHistoryManagement';
import { useWeatherCoordination } from './hooks/useWeatherCoordination';
import { useErrorHandling } from './hooks/useErrorHandling';
import { useMobileDrawer } from './hooks/useMobileDrawer';
import SearchSection from './sections/SearchSection';
import WeatherSection from './sections/WeatherSection';
import HistorySection from './sections/HistorySection';
import MapSection from './sections/MapSection';
import HamburgerButton from './components/HamburgerButton';
import MobileDrawer from './components/MobileDrawer';
import BackgroundManager from './managers/BackgroundManager';
import '@app/styles/index.scss';

const WeatherWidgetContainer: React.FC = () => {
  // Hook para scroll
  const { scrollToTop, scrollToTopImmediate } = useScrollToTop();

  // Hook para el drawer móvil
  const {
    isDrawerOpen,
    isMobile,
    closeDrawer,
    toggleDrawer,
  } = useMobileDrawer();

  // Hooks especializados
  const {
    showSuggestions,
    currentQuery,
    handleSearch,
    handleSelectSuggestion,
    handleFocus,
    handleBlur,
  } = useSearchManagement({ onScrollToTop: scrollToTop });

  const {
    handleHistorySearch,
    handleClearHistory,
  } = useHistoryManagement({ onScrollToTop: scrollToTop });

  // Wrapper para cerrar el drawer al seleccionar una ciudad
  const handleHistorySearchWithClose = (city: any) => {
    handleHistorySearch(city);
    if (isMobile) {
      closeDrawer();
    }
  };

  const {
    lastUpdateTime,
    hasInitialData,
  } = useWeatherCoordination({ onScrollToTopImmediate: scrollToTopImmediate });

  const { contextHolder } = useErrorHandling();

  return (
    <>
      {contextHolder}
      
      {/* Fondo que cubre toda la pantalla con LazyLoading */}
      <BackgroundManager />
      
      {/* Botón hamburguesa para móviles */}
      <HamburgerButton
        onToggle={toggleDrawer}
        isOpen={isDrawerOpen}
      />
      
      <div className="weather-widget">
        {/* Anchor point para scroll */}
        <div id="weather-widget-top" style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '10px', 
          height: '10px', 
          opacity: 0,
          pointerEvents: 'none',
          zIndex: 1000
        }} />
        
        <div className="weather-widget__container">
          
          {/* Sección de búsqueda */}
          <SearchSection
            onSearch={handleSearch}
            onSelectSuggestion={handleSelectSuggestion}
            onFocus={handleFocus}
            onBlur={handleBlur}
            showSuggestions={showSuggestions}
            currentQuery={currentQuery}
          />

          {/* Sección del clima */}
          <WeatherSection
            lastUpdateTime={lastUpdateTime}
            hasInitialData={hasInitialData}
          />

          {/* Sección del historial - solo mostrar en desktop */}
          {!isMobile && (
            <HistorySection
              onSelectSearch={handleHistorySearch}
              onClearHistory={handleClearHistory}
            />
          )}

          {/* Sección del mapa */}
          <MapSection />
        </div>
      </div>

      {/* Drawer móvil para el historial */}
      <MobileDrawer
        open={isDrawerOpen}
        onClose={closeDrawer}
        onSelectSearch={handleHistorySearchWithClose}
        onClearHistory={handleClearHistory}
      />
    </>
  );
};

export default WeatherWidgetContainer; 