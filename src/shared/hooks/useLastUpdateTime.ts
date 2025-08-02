import { useState, useCallback } from 'react';

export const useLastUpdateTime = () => {
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [hasInitialData, setHasInitialData] = useState(false);

  const updateLastUpdateTime = useCallback(() => {
    setLastUpdateTime(new Date());
    setHasInitialData(true);
  }, []);

  return {
    lastUpdateTime,
    hasInitialData,
    updateLastUpdateTime
  };
}; 