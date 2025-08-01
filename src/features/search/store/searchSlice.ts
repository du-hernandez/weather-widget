import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { SearchState, SearchResult, SearchHistoryItem } from '../types';

const initialState: SearchState = {
  isLoading: false,
  error: null,
  searchResults: [],
  searchHistory: [],
  currentQuery: '',
  selectedResult: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setSearchResults: (state, action: PayloadAction<SearchResult[]>) => {
      state.searchResults = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setCurrentQuery: (state, action: PayloadAction<string>) => {
      state.currentQuery = action.payload;
    },
    setSelectedResult: (state, action: PayloadAction<SearchResult | null>) => {
      state.selectedResult = action.payload;
    },
    addToHistory: (state, action: PayloadAction<SearchResult>) => {
      const { name, country, lat, lon } = action.payload;
      const historyItem: SearchHistoryItem = {
        id: `${name}-${country}-${Date.now()}`,
        city: name,
        country,
        timestamp: Date.now(),
        coordinates: { lat, lon },
      };

      // Evitar duplicados en el historial
      const existingIndex = state.searchHistory.findIndex(
        item => item.city === name && item.country === country
      );

      if (existingIndex !== -1) {
        // Actualizar timestamp si ya existe
        state.searchHistory[existingIndex].timestamp = Date.now();
      } else {
        // Agregar nuevo item al inicio
        state.searchHistory.unshift(historyItem);
      }

      // Mantener solo los últimos 10 items
      if (state.searchHistory.length > 10) {
        state.searchHistory = state.searchHistory.slice(0, 10);
      }
    },
    removeFromHistory: (state, action: PayloadAction<string>) => {
      state.searchHistory = state.searchHistory.filter(
        item => item.id !== action.payload
      );
    },
    clearHistory: (state) => {
      state.searchHistory = [];
    },
    clearSearch: (state) => {
      state.searchResults = [];
      state.currentQuery = '';
      state.selectedResult = null;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setSearchResults,
  setCurrentQuery,
  setSelectedResult,
  addToHistory,
  removeFromHistory,
  clearHistory,
  clearSearch,
} = searchSlice.actions;

export default searchSlice.reducer; 