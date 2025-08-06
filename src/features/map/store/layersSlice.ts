import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { LayersState, LayerTogglePayload, LayerOpacityPayload } from '../types/layers';
import { DEFAULT_LAYERS } from '../config/weatherLayers';

/**
 * Slice de Redux para gestionar el estado de las capas meteorológicas
 * 
 * Maneja:
 * - Lista de capas disponibles
 * - Capas actualmente activas/visibles  
 * - Estados de carga y error
 * - Configuración de opacidad por capa
 */

const initialState: LayersState = {
  availableLayers: DEFAULT_LAYERS,
  activeLayers: [], // Inicialmente ninguna capa activa
  isLoading: false,
  error: null,
};

const layersSlice = createSlice({
  name: 'map/layers',
  initialState,
  reducers: {
    toggleLayer: (state, action: PayloadAction<string>) => {
      const layerId = action.payload;
      const layer = state.availableLayers.find(l => l.id === layerId);
      
      if (layer) {
        // Alternar visibilidad de la capa
        layer.visible = !layer.visible;
        
        // Actualizar lista de capas activas
        if (layer.visible) {
          // Agregar a activas si no está ya
          if (!state.activeLayers.includes(layerId)) {
            state.activeLayers.push(layerId);
          }
        } else {
          // Remover de activas
          state.activeLayers = state.activeLayers.filter(id => id !== layerId);
        }
      }
    },
    
    setLayerVisibility: (state, action: PayloadAction<LayerTogglePayload>) => {
      const { layerId, visible } = action.payload;
      const layer = state.availableLayers.find(l => l.id === layerId);
      
      if (layer && visible !== undefined) {
        layer.visible = visible;
        
        if (visible) {
          if (!state.activeLayers.includes(layerId)) {
            state.activeLayers.push(layerId);
          }
        } else {
          state.activeLayers = state.activeLayers.filter(id => id !== layerId);
        }
      }
    },
    
    setLayerOpacity: (state, action: PayloadAction<LayerOpacityPayload>) => {
      const { layerId, opacity } = action.payload;
      const layer = state.availableLayers.find(l => l.id === layerId);
      
      if (layer) {
        // Asegurar que la opacidad esté entre 0 y 1
        layer.opacity = Math.max(0, Math.min(1, opacity));
      }
    },
    
    clearAllLayers: (state) => {
      // Desactivar todas las capas
      state.availableLayers.forEach(layer => {
        layer.visible = false;
      });
      state.activeLayers = [];
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
  },
});

export const {
  toggleLayer,
  setLayerVisibility,
  setLayerOpacity,
  clearAllLayers,
  setLoading,
  setError,
} = layersSlice.actions;

export default layersSlice.reducer;