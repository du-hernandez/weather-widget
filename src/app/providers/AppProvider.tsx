import React from 'react';
import ReduxProvider from './ReduxProvider';
import QueryProvider from './QueryProvider';

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <ReduxProvider>
      <QueryProvider>
        {children}
      </QueryProvider>
    </ReduxProvider>
  );
};

export default AppProvider; 