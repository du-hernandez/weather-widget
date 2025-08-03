import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@app/store';

// Selectores básicos
export const selectWeatherState = (state: RootState) => state.weather;
export const selectCurrentWeather = (state: RootState) => state.weather.currentWeather;
export const selectForecast = (state: RootState) => state.weather.forecast;
export const selectSelectedCity = (state: RootState) => state.weather.selectedCity;
export const selectSelectedCoordinates = (state: RootState) => state.weather.selectedCoordinates;
export const selectUnits = (state: RootState) => state.weather.units;
export const selectIsLoading = (state: RootState) => state.weather.isLoading;
export const selectError = (state: RootState) => state.weather.error;

// Selectores derivados
export const selectHasWeatherData = createSelector(
  [selectCurrentWeather],
  (currentWeather) => currentWeather !== null
);

export const selectHasForecastData = createSelector(
  [selectForecast],
  (forecast) => forecast !== null
);

export const selectWeatherDescription = createSelector(
  [selectCurrentWeather],
  (currentWeather) => currentWeather?.weather[0]?.description || ''
);

export const selectWeatherIcon = createSelector(
  [selectCurrentWeather],
  (currentWeather) => currentWeather?.weather[0]?.icon || ''
);

export const selectTemperature = createSelector(
  [selectCurrentWeather, selectUnits],
  (currentWeather, units) => {
    if (!currentWeather) return null;
    return {
      current: currentWeather.main.temp,
      feelsLike: currentWeather.main.feels_like,
      min: currentWeather.main.temp_min,
      max: currentWeather.main.temp_max,
      units,
    };
  }
); 