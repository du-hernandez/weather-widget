import type { LatLng } from 'leaflet';

export interface MapState {
  center: [number, number];
  zoom: number;
  selectedLocation: SelectedLocation | null;
  isLoading: boolean;
  error: string | null;
}

export interface SelectedLocation {
  lat: number;
  lng: number;
  city?: string;
  country?: string;
  timestamp: number;
}

export interface MapClickEvent {
  latlng: LatLng;
  originalEvent: MouseEvent;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface GeocodingResult {
  name: string;
  lat: number;
  lng: number;
  country: string;
  state?: string;
} 