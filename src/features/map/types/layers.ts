/**
 * Tipos para el sistema de capas meteorológicas del mapa
 */

export interface WeatherLayer {
  id: string;
  name: string;
  url: string;
  attribution: string;
  opacity: number;
  visible: boolean;
  zIndex: number;
  description?: string;
}

export type WeatherLayerType = 
  | 'precipitation' 
  | 'temperature' 
  | 'clouds' 
  | 'wind' 
  | 'pressure';

export interface LayersState {
  availableLayers: WeatherLayer[];
  activeLayers: string[];
  isLoading: boolean;
  error: string | null;
}

export interface LayerTogglePayload {
  layerId: string;
  visible?: boolean;
}

export interface LayerOpacityPayload {
  layerId: string;
  opacity: number;
}