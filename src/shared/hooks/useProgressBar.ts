import { useState, useEffect, useCallback, useMemo } from 'react';

interface UseProgressBarProps {
  lastUpdateTime: Date | null;
  maxTime: number; // en minutos
  hasInitialData: boolean;
}

interface UseProgressBarReturn {
  progress: number;
  formattedTime: string;
  currentTime: Date;
  shouldAnimate: boolean;
}

export const useProgressBar = ({ lastUpdateTime, maxTime, hasInitialData }: UseProgressBarProps): UseProgressBarReturn => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Calcular progreso usando useMemo para evitar recálculos innecesarios
  const progress = useMemo(() => {
    // Si no hay datos iniciales, mostrar 0%
    if (!hasInitialData || !lastUpdateTime) {
      return 0;
    }

    const timeDiff = currentTime.getTime() - lastUpdateTime.getTime();
    const maxTimeMs = maxTime * 60 * 1000; // convertir minutos a milisegundos
    return Math.min((timeDiff / maxTimeMs) * 100, 100);
  }, [currentTime, lastUpdateTime, maxTime, hasInitialData]);

  // Formatear tiempo usando useMemo
  const formattedTime = useMemo(() => {
    // Si no hay datos iniciales, mostrar mensaje apropiado
    if (!hasInitialData || !lastUpdateTime) {
      return 'Sin datos';
    }

    const timeDiff = currentTime.getTime() - lastUpdateTime.getTime();
    const minutes = Math.floor(timeDiff / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
    
    if (minutes === 0) {
      return `hace ${seconds} segundos`;
    } else if (minutes === 1) {
      return `hace ${minutes} minuto`;
    } else {
      return `hace ${minutes} minutos`;
    }
  }, [currentTime, lastUpdateTime, hasInitialData]);

  // Determinar si debe animar
  const shouldAnimate = useMemo(() => {
    return hasInitialData && lastUpdateTime !== null;
  }, [hasInitialData, lastUpdateTime]);

  // Actualizar tiempo actual usando useCallback
  const updateCurrentTime = useCallback(() => {
    setCurrentTime(new Date());
  }, []);

  // Efecto para actualizar el tiempo cada segundo (solo si hay datos iniciales)
  useEffect(() => {
    if (shouldAnimate) {
      const interval = setInterval(updateCurrentTime, 1000);
      return () => clearInterval(interval);
    }
  }, [updateCurrentTime, shouldAnimate]);

  return {
    progress,
    formattedTime,
    currentTime,
    shouldAnimate
  };
}; 