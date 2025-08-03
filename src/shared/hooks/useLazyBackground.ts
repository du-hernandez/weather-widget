import { useState, useEffect } from 'react';

interface UseLazyBackgroundOptions {
  placeholderUrl: string;
  realImageUrl: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const useLazyBackground = ({
  placeholderUrl,
  realImageUrl,
  onLoad,
  onError
}: UseLazyBackgroundOptions) => {
  const [currentImage, setCurrentImage] = useState(placeholderUrl);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Crear una nueva imagen para precargar
    const img = new Image();
    
    img.onload = () => {
      setCurrentImage(realImageUrl);
      setIsLoading(false);
      onLoad?.();
    };

    img.onerror = () => {
      // Si falla la imagen real, mantener el placeholder
      setIsLoading(false);
      onError?.();
    };

    // Iniciar la carga de la imagen real
    img.src = realImageUrl;

    // Cleanup function
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [realImageUrl, onLoad, onError]);

  return {
    backgroundImage: currentImage,
    isLoading
  };
}; 