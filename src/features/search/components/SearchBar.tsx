import React, { useEffect, useState } from 'react';
import { Input, Space } from 'antd';
import { useAppDispatch, useAppSelector } from '@shared/hooks/redux';
import { setCurrentQuery } from '../store/searchSlice';
import { selectCurrentQuery } from '../store/selectors';
import { useDebounce } from '@shared/hooks/useDebounce';


const { Search } = Input;

interface SearchBarProps {
  onSearch: (query: string) => void;
  onShowHistory?: () => void;
  placeholder?: string;
  loading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Buscar ciudad...',
  loading = false,
}) => {
  const dispatch = useAppDispatch();
  const currentQuery = useAppSelector(selectCurrentQuery);

  
  
  const [inputValue, setInputValue] = useState(currentQuery);
  
  // Implementar debounce para optimizar las búsquedas
  const debouncedInputValue = useDebounce(inputValue, 300);

  useEffect(() => {
    if (debouncedInputValue !== '') {
      handleSearch(debouncedInputValue);
    }
  }, [debouncedInputValue]);

  const handleSearch = (value: string) => {
    if (value.trim()) {
      dispatch(setCurrentQuery(value.trim()));
      onSearch(value.trim());
    }
  };

  return (
    <Space.Compact style={{ width: '100%' }}>
      <Search
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        loading={loading}
        allowClear
        style={{ flex: 1 }}
      />
    </Space.Compact>
  );
};

export default SearchBar; 