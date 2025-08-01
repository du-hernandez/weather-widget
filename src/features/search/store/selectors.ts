import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../../app/store';

// Selectores básicos
export const selectSearchState = (state: RootState) => state.search;
export const selectSearchResults = (state: RootState) => state.search.searchResults;
export const selectSearchHistory = (state: RootState) => state.search.searchHistory;
export const selectCurrentQuery = (state: RootState) => state.search.currentQuery;
export const selectSelectedResult = (state: RootState) => state.search.selectedResult;
export const selectSearchIsLoading = (state: RootState) => state.search.isLoading;
export const selectSearchError = (state: RootState) => state.search.error;

// Selectores derivados
export const selectHasSearchResults = createSelector(
  [selectSearchResults],
  (searchResults) => searchResults.length > 0
);

export const selectHasSearchHistory = createSelector(
  [selectSearchHistory],
  (searchHistory) => searchHistory.length > 0
);

export const selectRecentSearchHistory = createSelector(
  [selectSearchHistory],
  (searchHistory) => searchHistory.slice(0, 5) // Solo los 5 más recientes
);

export const selectSearchHistoryByCity = createSelector(
  [selectSearchHistory, selectCurrentQuery],
  (searchHistory, currentQuery) => {
    if (!currentQuery) return searchHistory;
    return searchHistory.filter(item =>
      item.city.toLowerCase().includes(currentQuery.toLowerCase()) ||
      item.country.toLowerCase().includes(currentQuery.toLowerCase())
    );
  }
); 