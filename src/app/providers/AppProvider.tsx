import React from 'react';
import ReduxProvider from './ReduxProvider';
import QueryProvider from './QueryProvider';
import MessageProvider from './MessageProvider';

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <ReduxProvider>
      <QueryProvider>
        <MessageProvider>
          {children}
        </MessageProvider>
      </QueryProvider>
    </ReduxProvider>
  );
};

export default AppProvider; 