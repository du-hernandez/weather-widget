import React from 'react';
import { useProgressBar } from '@shared/hooks/useProgressBar';

interface ProgressBarProps {
  lastUpdateTime: Date | null;
  maxTime: number; // en minutos
  hasInitialData: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = React.memo(({ lastUpdateTime, maxTime, hasInitialData }) => {
  const { progress, formattedTime, shouldAnimate } = useProgressBar({ lastUpdateTime, maxTime, hasInitialData });

  return (
    <div className="progress-bar">
      <div className="progress-bar__header">
        <span className="progress-bar__label">Última actualización</span>
        <span className="progress-bar__time">{formattedTime}</span>
      </div>
      <div className="progress-bar__container">
        <div 
          className={`progress-bar__fill ${shouldAnimate ? 'progress-bar__fill--animated' : ''}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
});

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar; 