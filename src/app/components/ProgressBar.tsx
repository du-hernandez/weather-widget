import React, { useState, useEffect } from 'react';

interface ProgressBarProps {
  lastUpdateTime?: Date;
  maxTime?: number; // Tiempo máximo en minutos (default: 60 min)
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  lastUpdateTime = new Date(), 
  maxTime = 60 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Actualizar cada segundo

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeDiff = currentTime.getTime() - lastUpdateTime.getTime();
    const minutesDiff = timeDiff / (1000 * 60);
    const progressPercent = Math.max(0, Math.min(100, (minutesDiff / maxTime) * 100));
    
    setProgress(100 - progressPercent); // Invertir para que 100% = datos frescos
  }, [currentTime, lastUpdateTime, maxTime]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };



  return (
    <div className="progress-bar">
      <div className="progress-bar__content">
        <span className="progress-bar__label">Última actualización</span>
        <div className="progress-bar__bar">
          <div 
            className="progress-bar__fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <span className="progress-bar__time">
        {formatTime(lastUpdateTime)}
      </span>
    </div>
  );
};

export default ProgressBar; 