import React, { useState } from 'react';
import { useLazyBackground } from '@shared/hooks/useLazyBackground';
import { BACKGROUND_CONFIG } from '@shared/config/backgrounds';

const BackgroundManager: React.FC = () => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  
  // Obtener configuración del fondo weather
  const { placeholderUrl, realImageUrl } = BACKGROUND_CONFIG.weather;

  // LazyLoading para el fondo usando el hook existente
  const { backgroundImage } = useLazyBackground({ 
    placeholderUrl, 
    realImageUrl, 
    onLoad: () => setIsImageLoaded(true), 
    onError: () => {} 
  });

  return (
    <div
      className={`weather-widget-background ${isImageLoaded ? 'image-loaded' : ''}`}
      style={{
        '--background-image': `url('${backgroundImage}')`
      } as React.CSSProperties}
    />
  );
};

export default BackgroundManager; 