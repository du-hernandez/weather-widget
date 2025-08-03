import React, { useEffect, useState } from 'react';
import { Input, Space } from 'antd';
import { useAppDispatch, useAppSelector } from '@shared/hooks/redux';
import { setCurrentQuery } from '../store/searchSlice';
import { selectCurrentQuery } from '../store/selectors';
import { useDebounce } from '@shared/hooks/useDebounce';
import { LocationButton } from '@/app/components/LocationButton';


const { Search } = Input;

interface SearchBarProps {
  onSearch: (query: string) => void;
  onShowHistory?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  loading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Buscar ciudad...',
  loading = false,
  onFocus,
  onBlur,
}) => {
  const dispatch = useAppDispatch();
  const currentQuery = useAppSelector(selectCurrentQuery);

  
  
  const [inputValue, setInputValue] = useState(currentQuery);
  
  // Implementar debounce para optimizar las búsquedas
  const debouncedInputValue = useDebounce(inputValue, 300);

  useEffect(() => {
    if (debouncedInputValue.length > 2 ) {
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
    <div className="search-bar-container">
      <Space.Compact className="search-bar-content">
        <Search
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          loading={loading}
          allowClear
          style={{ flex: 1 }}
          onFocus={onFocus}
          onBlur={onBlur}
        />
    </Space.Compact>
    <LocationButton
        size="middle"
        className="search-location-btn"
        showSuccessMessage={false}
        showErrorMessage={true}
      />
    </div>
  );
};

export default SearchBar; 