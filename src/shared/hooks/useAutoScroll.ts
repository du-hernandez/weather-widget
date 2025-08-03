import { useCallback, useEffect, useRef } from 'react';

/**
 * Hook para manejar auto-scroll cuando se completa una búsqueda
 */
export const useAutoScroll = () => {
  const scrollTimeoutRef = useRef<number | null>(null);

  /**
   * Función para hacer scroll suave a la parte superior
   */
  const scrollToTop = useCallback((delay: number = 500) => {
    // Limpiar timeout anterior si existe
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Programar el scroll con delay para que se ejecute después de que se complete la búsqueda
    scrollTimeoutRef.current = window.setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, delay);
  }, []);

  /**
   * Función para hacer scroll inmediato a la parte superior
   */
  const scrollToTopImmediate = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  /**
   * Función para hacer scroll a un elemento específico
   */
  const scrollToElement = useCallback((elementId: string, delay: number = 500) => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = window.setTimeout(() => {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, delay);
  }, []);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return {
    scrollToTop,
    scrollToTopImmediate,
    scrollToElement
  };
}; 