// Tipos compartidos para toda la aplicación
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface City {
  name: string;
  country: string;
  coord: Coordinates;
} 