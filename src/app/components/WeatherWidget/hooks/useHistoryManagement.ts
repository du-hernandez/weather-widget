import { useCallback } from 'react';
import { useAppDispatch } from '@shared/hooks/redux';
import { setSelectedCity } from '@features/weather/store/weatherSlice';
import { clearHistory } from '@/features/search/store/searchSlice';
import type { SearchResult } from '@features/search/types';

interface UseHistoryManagementProps {
  onScrollToTop: (delay?: number) => void;
}

export const useHistoryManagement = ({ onScrollToTop }: UseHistoryManagementProps) => {
  const dispatch = useAppDispatch();

  const handleHistorySearch = useCallback((city: SearchResult) => {
    dispatch(setSelectedCity(city));
    
    // Auto-scroll a la parte superior después de seleccionar del historial
    onScrollToTop(300);
  }, [dispatch, onScrollToTop]);

  const handleClearHistory = useCallback(() => {
    dispatch(clearHistory());
  }, [dispatch]);

  return {
    handleHistorySearch,
    handleClearHistory,
  };
}; 