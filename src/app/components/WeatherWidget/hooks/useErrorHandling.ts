import { useEffect } from 'react';
import { message } from 'antd';
import { useAppDispatch } from '@shared/hooks/redux';
import { useWeatherLoading } from '@shared/hooks/useLoading';
import { setError } from '@features/weather/store/weatherSlice';

export const useErrorHandling = () => {
  const dispatch = useAppDispatch();
  const { error } = useWeatherLoading();
  const [messageApi, contextHolder] = message.useMessage();

  // Manejo de errores con limpieza automática en Redux
  useEffect(() => {
    if (error) {
      messageApi.warning(error);
      
      setTimeout(() => {
        dispatch(setError(''));
      }, 1000);
    }
  }, [error, dispatch, messageApi]);

  return {
    messageApi,
    contextHolder,
  };
}; 