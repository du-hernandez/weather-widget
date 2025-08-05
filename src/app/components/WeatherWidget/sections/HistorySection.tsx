import React, { useMemo } from 'react';
import RecentSearchesPanel from '@features/search/components/RecentSearchesPanel';
import HamburgerButton from '@features/search/components/HamburgerButton';
import MobileDrawer from '@features/search/components/MobileDrawer';
import useMobileMenu from '@features/search/hooks/useMobileMenu';
import type { SearchResult } from '@features/search/types';

interface HistorySectionProps {
  onSelectSearch: (city: SearchResult) => void;
  onClearHistory: () => void;
}

const HistorySection: React.FC<HistorySectionProps> = ({
  onSelectSearch,
  onClearHistory,
}) => {
  const { isMobile, isMenuOpen, toggleMenu, closeMenu } = useMobileMenu();

  // Memoizar props del RecentSearchesPanel
  const recentSearchesProps = useMemo(() => ({
    onSelectSearch,
    onClearHistory
  }), [onSelectSearch, onClearHistory]);

  return (
    <>
      {/* Botón hamburguesa solo en móviles */}
      {isMobile && (
        <div className="hamburger-button-container">
          <HamburgerButton
            isOpen={isMenuOpen}
            onClick={toggleMenu}
            aria-label="Abrir menú de búsquedas recientes"
          />
        </div>
      )}

      {/* Panel normal para desktop */}
      {!isMobile && (
        <div style={{ gridArea: 'history' }}>
          <RecentSearchesPanel {...recentSearchesProps} />
        </div>
      )}

      {/* Drawer para móviles */}
      {isMobile && (
        <MobileDrawer
          isOpen={isMenuOpen}
          onClose={closeMenu}
          onSelectSearch={onSelectSearch}
          onClearHistory={onClearHistory}
        />
      )}
    </>
  );
};

export default HistorySection; 