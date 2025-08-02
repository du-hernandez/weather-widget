import type { WeatherState } from '@features/weather/types';
import type { SearchState } from '@features/search/types';
import type { MapState } from '@features/map/types';

export interface RootState {
  weather: WeatherState;
  search: SearchState;
  map: MapState;
} 