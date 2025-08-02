import { useState, useEffect } from 'react';

/**
 * Hook para debounce de valores
 * @param value - Valor a debounciar
 * @param delay - Delay en milisegundos (default: 500ms)
 * @returns Valor debounciado
 */
export const useDebounce = <T>(value: T, delay: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}; 