import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from '@features/weather/store/weatherSlice';
import searchReducer from '@features/search/store/searchSlice';
import type { RootState } from './types';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    search: searchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorar acciones de Redux Toolkit que no son serializables
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type { RootState };
export type AppDispatch = typeof store.dispatch; 