import type { RootState } from '@app/store/types';
import type { WeatherLayer } from '../types/layers';

/**
 * Selectores para acceder al estado de las capas meteorológicas
 * 
 * Proporcionan una interfaz limpia para obtener datos específicos 
 * del estado de capas sin exponer la estructura interna del store
 */

// Selectores básicos
export const selectLayersState = (state: RootState) => state.map.layers;

export const selectAvailableLayers = (state: RootState) => 
  selectLayersState(state).availableLayers;

export const selectActiveLayers = (state: RootState) => 
  selectLayersState(state).activeLayers;

export const selectLayersLoading = (state: RootState) => 
  selectLayersState(state).isLoading;

export const selectLayersError = (state: RootState) => 
  selectLayersState(state).error;

// Selectores computados
export const selectLayerById = (state: RootState, layerId: string): WeatherLayer | undefined =>
  selectAvailableLayers(state).find(layer => layer.id === layerId);

export const selectVisibleLayers = (state: RootState) =>
  selectAvailableLayers(state).filter(layer => layer.visible);

export const selectLayerByType = (state: RootState, layerType: string) =>
  selectAvailableLayers(state).find(layer => layer.id === layerType);

// Selector para verificar si una capa específica está activa
export const selectIsLayerActive = (state: RootState, layerId: string) =>
  selectActiveLayers(state).includes(layerId);

// Selector para obtener el número de capas activas
export const selectActiveLayersCount = (state: RootState) =>
  selectActiveLayers(state).length;

// Selector para verificar si hay alguna capa visible
export const selectHasVisibleLayers = (state: RootState) =>
  selectVisibleLayers(state).length > 0;