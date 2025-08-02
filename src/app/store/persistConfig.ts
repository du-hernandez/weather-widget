import storage from 'redux-persist/lib/storage';

// Configuración de persistencia para search history
export const searchPersistConfig = {
  key: 'search',
  storage,
  whitelist: ['searchHistory'], // Solo persistir el historial de búsqueda
  blacklist: ['searchResults', 'currentQuery', 'selectedResult', 'isLoading', 'error'], // No persistir estos campos
};

// Configuración general de persistencia
export const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['search'], // Solo persistir el slice de search
  blacklist: ['weather'], // No persistir weather (datos temporales)
}; 