/**
 * Re-exporta las acciones de capas con el namespace correcto para usar con el mapa
 * 
 * Esto permite que las acciones de capas funcionen correctamente cuando están
 * anidadas dentro del slice del mapa usando extraReducers
 */

import { 
  toggleLayer as _toggleLayer,
  setLayerVisibility as _setLayerVisibility,
  setLayerOpacity as _setLayerOpacity,
  clearAllLayers as _clearAllLayers,
  setLoading as _setLayersLoading,
  setError as _setLayersError,
} from './layersSlice';

// Re-exportar las acciones con el namespace de capas
export const layersActions = {
  toggleLayer: _toggleLayer,
  setLayerVisibility: _setLayerVisibility,
  setLayerOpacity: _setLayerOpacity,
  clearAllLayers: _clearAllLayers,
  setLoading: _setLayersLoading,
  setError: _setLayersError,
};

// Exportar individualmente para conveniencia
export const {
  toggleLayer,
  setLayerVisibility,
  setLayerOpacity,
  clearAllLayers,
  setLoading: setLayersLoading,
  setError: setLayersError,
} = layersActions;