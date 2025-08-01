import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { WeatherState, WeatherData, ForecastData } from '../types';

const initialState: WeatherState = {
  isLoading: false,
  error: null,
  currentWeather: null,
  forecast: null,
  selectedCity: null,
  units: 'metric',
};

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
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
    setCurrentWeather: (state, action: PayloadAction<WeatherData>) => {
      state.currentWeather = action.payload;
      state.selectedCity = action.payload.name;
      state.isLoading = false;
      state.error = null;
    },
    setForecast: (state, action: PayloadAction<ForecastData>) => {
      state.forecast = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setSelectedCity: (state, action: PayloadAction<string>) => {
      state.selectedCity = action.payload;
    },
    setUnits: (state, action: PayloadAction<'metric' | 'imperial'>) => {
      state.units = action.payload;
    },
    clearWeather: (state) => {
      state.currentWeather = null;
      state.forecast = null;
      state.selectedCity = null;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setCurrentWeather,
  setForecast,
  setSelectedCity,
  setUnits,
  clearWeather,
} = weatherSlice.actions;

export default weatherSlice.reducer; 