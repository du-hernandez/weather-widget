import type { WeatherState } from '@features/weather/types';
import type { SearchState } from '@features/search/types';

export interface RootState {
  weather: WeatherState;
  search: SearchState;
} 