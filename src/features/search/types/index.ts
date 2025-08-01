import type { LoadingState } from '../../../shared/types';

export interface SearchResult {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

export interface SearchHistoryItem {
  id: string;
  city: string;
  country: string;
  timestamp: number;
  coordinates: {
    lat: number;
    lon: number;
  };
}

export interface SearchState extends LoadingState {
  searchResults: SearchResult[];
  searchHistory: SearchHistoryItem[];
  currentQuery: string;
  selectedResult: SearchResult | null;
}

export interface GeocodingResponse {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
} 