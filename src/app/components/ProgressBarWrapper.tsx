import React, { useMemo } from 'react';
import ProgressBar from './ProgressBar';

interface ProgressBarWrapperProps {
  lastUpdateTime: Date | null;
  maxTime?: number;
  hasInitialData: boolean;
}

const ProgressBarWrapper: React.FC<ProgressBarWrapperProps> = React.memo(({ 
  lastUpdateTime, 
  maxTime = 10,
  hasInitialData
}) => {
  // Memoizar las props para evitar re-renders innecesarios
  const progressBarProps = useMemo(() => ({
    lastUpdateTime,
    maxTime,
    hasInitialData
  }), [lastUpdateTime, maxTime, hasInitialData]);

  return (
    <div style={{ gridArea: 'progress' }}>
      <ProgressBar {...progressBarProps} />
    </div>
  );
});

ProgressBarWrapper.displayName = 'ProgressBarWrapper';

export default ProgressBarWrapper; 