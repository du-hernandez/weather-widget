import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { MapState, SelectedLocation } from '../types';
import layersReducer from './layersSlice';
import { DEFAULT_LAYERS } from '../config/weatherLayers';

const initialState: MapState = {
  center: [0, 0], // Centro del mundo
  zoom: 2,
  selectedLocation: null,
  isLoading: false,
  error: null,
  layers: {
    availableLayers: DEFAULT_LAYERS,
    activeLayers: [],
    isLoading: false,
    error: null,
  },
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setCenter: (state, action: PayloadAction<[number, number]>) => {
      state.center = action.payload;
    },
    setZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },
    setSelectedLocation: (state, action: PayloadAction<SelectedLocation | null>) => {
      state.selectedLocation = action.payload;
    },
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
    clearMap: (state) => {
      state.selectedLocation = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Integrar las acciones de capas dentro del slice del mapa
    builder.addMatcher(
      (action) => action.type.startsWith('map/layers/'),
      (state, action) => {
        // Delegar todas las acciones de 'map/layers/' al reducer de capas
        state.layers = layersReducer(state.layers, action);
      }
    );
  },
});

export const {
  setCenter,
  setZoom,
  setSelectedLocation,
  setLoading,
  setError,
  clearMap,
} = mapSlice.actions;

export default mapSlice.reducer; 