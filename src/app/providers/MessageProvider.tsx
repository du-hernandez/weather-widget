import React, { useEffect } from 'react';
import { message } from 'antd';

/**
 * Provider para configurar message globalmente
 */
const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Configurar message globalmente
    message.config({
      duration: 4, // 4 segundos
      maxCount: 3, // Máximo 3 mensajes simultáneos
      top: 24, // Distancia desde arriba
      rtl: false, // Left to right
    });
  }, []);

  return <>{children}</>;
};

export default MessageProvider; 