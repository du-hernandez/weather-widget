import React, { useEffect, useState } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import RecentSearchesPanel from '@features/search/components/RecentSearchesPanel';
import type { SearchResult } from '@features/search/types';

interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  onSelectSearch?: (city: SearchResult) => void;
  onClearHistory?: () => void;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({
  open,
  onClose,
  onSelectSearch,
  onClearHistory,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  // Prevenir scroll del body cuando el drawer está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setIsClosing(false);
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300); // Duración de la animación
  };

  // Wrapper para onSelectSearch que también cierra el drawer
  const handleSelectSearch = (city: SearchResult) => {
    if (onSelectSearch) {
      onSelectSearch(city);
    }
    // Cerrar el drawer después de seleccionar
    handleClose();
  };

  if (!open && !isClosing) return null;

  return (
    <>
      {/* Overlay con blur */}
      <div 
        className={`mobile-drawer-overlay ${isClosing ? 'closing' : ''}`}
        onClick={handleClose}
      />
      
      {/* Drawer personalizado */}
      <div className={`mobile-drawer-container ${isClosing ? 'closing' : ''}`}>
        {/* <div className="mobile-drawer-header">
          <h3 className="mobile-drawer-title">
            Búsquedas recientes
          </h3>
          <button 
            className="mobile-drawer-close"
            onClick={handleClose}
            aria-label="Cerrar menú"
          >
            <CloseOutlined />
          </button>
        </div> */}
        
        <div className="mobile-drawer-content">
          <RecentSearchesPanel
            onSelectSearch={handleSelectSearch}
            onClearHistory={onClearHistory}
          />
        </div>
      </div>
    </>
  );
};

export default MobileDrawer; 