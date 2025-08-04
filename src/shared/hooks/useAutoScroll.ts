import { useCallback } from 'react';

/**
 * Custom hook para manejar scroll hacia la parte superior
 */
export const useScrollToTop = () => {
  /**
   * Función de scroll nativo con target específico
   */
  const scrollToTop = useCallback((delay: number = 300, targetId: string = 'weather-widget-top') => {
    setTimeout(() => {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        // Fallback a window.scrollTo si no encuentra el elemento
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }, delay);
  }, []);

  /**
   * Función de scroll inmediato
   */
  const scrollToTopImmediate = useCallback((targetId: string = 'weather-widget-top') => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      // Fallback a window.scrollTo si no encuentra el elemento
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, []);

  return {
    scrollToTop,
    scrollToTopImmediate
  };
}; 