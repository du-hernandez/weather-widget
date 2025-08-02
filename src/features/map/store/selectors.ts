import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@app/store';

// Selectores básicos
export const selectMapState = (state: RootState) => state.map;
export const selectMapCenter = (state: RootState) => state.map.center;
export const selectMapZoom = (state: RootState) => state.map.zoom;
export const selectSelectedLocation = (state: RootState) => state.map.selectedLocation;
export const selectMapIsLoading = (state: RootState) => state.map.isLoading;
export const selectMapError = (state: RootState) => state.map.error;

// Selectores derivados
export const selectHasSelectedLocation = createSelector(
  [selectSelectedLocation],
  (selectedLocation) => selectedLocation !== null
);

export const selectMapCoordinates = createSelector(
  [selectSelectedLocation],
  (selectedLocation) => {
    if (!selectedLocation) return null;
    return {
      lat: selectedLocation.lat,
      lng: selectedLocation.lng,
    };
  }
);

export const selectMapLocationInfo = createSelector(
  [selectSelectedLocation],
  (selectedLocation) => {
    if (!selectedLocation) return null;
    return {
      city: selectedLocation.city,
      country: selectedLocation.country,
      coordinates: `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`,
      timestamp: selectedLocation.timestamp,
    };
  }
); 