import React, { useEffect } from 'react';
import { Drawer } from 'antd';
import type { DrawerProps } from 'antd';
import RecentSearchesPanel from './RecentSearchesPanel';
import type { SearchResult } from '../types';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSearch?: (city: SearchResult) => void;
  onClearHistory?: () => void;
}

// const useStyle = createStyles(({ token }) => ({
//   'my-drawer-body': {
//     background: token.blue1,
//   },
//   'my-drawer-mask': {
//     boxShadow: `inset 0 0 15px #fff`,
//   },
//   'my-drawer-header': {
//     background: token.green1,
//   },
//   'my-drawer-footer': {
//     color: token.colorPrimary,
//   },
//   'my-drawer-content': {
//     borderInlineStart: '2px dotted #333',
//   },
// }));

const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  onSelectSearch,
  onClearHistory,
}) => {
  // Cerrar drawer con tecla Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevenir scroll del body cuando el drawer está abierto
      document.body.style.overflow = 'hidden';
      // Agregar clase para manejar z-index de sugerencias
      document.body.classList.add('mobile-history-drawer-open');
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
      // Remover clase cuando se cierra el drawer
      document.body.classList.remove('mobile-history-drawer-open');
    };
  }, [isOpen, onClose]);

  const drawerProps: DrawerProps = {
    open: isOpen,
    onClose: onClose,
    placement: 'bottom',
    width: '85%',
    height: '50%',
    // title: null,
    headerStyle: { display: 'none' },
    bodyStyle: { 
      padding: 0,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'transparent'
    },
    styles: {
        // Configura sombra del drawer
        // mask: {}
      body: {
        padding: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'transparent'
      },
    },
    className: 'mobile-history-drawer'
  };

  return (
    <Drawer {...drawerProps}>
      <RecentSearchesPanel
        onSelectSearch={(city) => {
          onSelectSearch?.(city);
          onClose(); // Cerrar drawer al seleccionar
        }}
        onClearHistory={onClearHistory}
      />
    </Drawer>
  );
};

export default MobileDrawer; 