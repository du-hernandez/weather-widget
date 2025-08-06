import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleLayer, setLayerOpacity, clearAllLayers } from '../store/layersActions';
import { 
  selectAvailableLayers, 
  selectActiveLayersCount,
  selectHasVisibleLayers 
} from '../store/layersSelectors';

/**
 * Control UI para gestionar las capas meteorológicas del mapa
 * 
 * Funcionalidades:
 * - Activar/desactivar capas individuales
 * - Ajustar opacidad de cada capa
 * - Limpiar todas las capas activas
 * - Mostrar descripción de cada capa
 * 
 * Se posiciona como un panel flotante sobre el mapa
 */

export const LayersControl: React.FC = () => {
  const dispatch = useDispatch();
  const layers = useSelector(selectAvailableLayers);
  const activeLayersCount = useSelector(selectActiveLayersCount);
  const hasVisibleLayers = useSelector(selectHasVisibleLayers);
  
  const handleToggleLayer = (layerId: string) => {
    dispatch(toggleLayer(layerId));
  };
  
  const handleOpacityChange = (layerId: string, opacity: number) => {
    dispatch(setLayerOpacity({ layerId, opacity }));
  };
  
  const handleClearAll = () => {
    dispatch(clearAllLayers());
  };
  
  return (
    <div className="layers-control">
      <div className="layers-control__header">
        <h4>Capas Meteorológicas</h4>
        {hasVisibleLayers && (
          <button 
            onClick={handleClearAll}
            className="layers-control__clear-btn"
            title="Desactivar todas las capas"
          >
            Limpiar ({activeLayersCount})
          </button>
        )}
      </div>
      
      <div className="layers-control__content">
        {layers.map(layer => (
          <div key={layer.id} className="layer-item" data-layer-type={layer.id}>
            <div className="layer-item__header">
              <label className="layer-toggle">
                <input
                  type="checkbox"
                  checked={layer.visible}
                  onChange={() => handleToggleLayer(layer.id)}
                  className="layer-toggle__checkbox"
                />
                <span className="layer-toggle__label">{layer.name}</span>
              </label>
            </div>
            
            {layer.description && (
              <p className="layer-item__description">{layer.description}</p>
            )}
            
            {layer.visible && (
              <div className="layer-item__controls">
                <label className="opacity-control">
                  <span>Opacidad: {Math.round(layer.opacity * 100)}%</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={layer.opacity}
                    onChange={(e) => handleOpacityChange(layer.id, parseFloat(e.target.value))}
                    className="opacity-control__slider"
                  />
                </label>
              </div>
            )}
          </div>
        ))}
        
        {layers.length === 0 && (
          <p className="layers-control__empty">
            No hay capas meteorológicas disponibles
          </p>
        )}
      </div>
    </div>
  );
};