import { useState, useEffect, useCallback } from 'react';

interface UseMobileMenuReturn {
  isMobile: boolean;
  isMenuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
  toggleMenu: () => void;
}

const useMobileMenu = (): UseMobileMenuReturn => {
  const [isMobile, setIsMobile] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Detectar si estamos en móvil (width <= 768px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Verificar al montar
    checkMobile();

    // Escuchar cambios de tamaño
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const openMenu = useCallback(() => {
    setIsMenuOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, [isMenuOpen]);

  return {
    isMobile,
    isMenuOpen,
    openMenu,
    closeMenu,
    toggleMenu,
  };
};

export default useMobileMenu; 