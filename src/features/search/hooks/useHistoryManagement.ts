import { useAppDispatch, useAppSelector } from '@shared/hooks/redux';
import { 
  selectSearchHistory, 
  selectHasSearchHistory
} from '../store/selectors';
import { 
  removeFromHistory, 
  clearHistory, 
  addToHistory 
} from '../store/searchSlice';
import type { SearchResult } from '../types';

/**
 * Hook para gestión completa del historial de búsquedas
 * @returns Funciones y datos del historial
 */
export const useHistoryManagement = () => {
  const dispatch = useAppDispatch();
  const history = useAppSelector(selectSearchHistory);
  const hasHistory = useAppSelector(selectHasSearchHistory);

  /**
   * Remover item del historial
   */
  const removeItem = (id: string) => {
    dispatch(removeFromHistory(id));
  };

  /**
   * Limpiar todo el historial
   */
  const clearAllHistory = () => {
    dispatch(clearHistory());
  };

  /**
   * Agregar ciudad al historial
   */
  const addCityToHistory = (city: SearchResult) => {
    dispatch(addToHistory(city));
  };

  return {
    history,
    hasHistory,
    removeItem,
    clearAllHistory,
    addCityToHistory,
    totalItems: history.length,
  };
}; 