import React, { useEffect, useState } from 'react';
import { Input, Button, Space, Tooltip, AutoComplete } from 'antd';
import type { AutoCompleteProps } from 'antd';
import { SearchOutlined, HistoryOutlined, ClearOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '@shared/hooks/redux';
import { setCurrentQuery, clearSearch } from '../store/searchSlice';
import { selectCurrentQuery, selectHasSearchHistory } from '../store/selectors';


const { Search } = Input;

interface SearchBarProps {
  onSearch: (query: string) => void;
  onShowHistory?: () => void;
  placeholder?: string;
  loading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onShowHistory,
  placeholder = 'Buscar ciudad...',
  loading = false,
}) => {
  const dispatch = useAppDispatch();
  const currentQuery = useAppSelector(selectCurrentQuery);
  const hasHistory = useAppSelector(selectHasSearchHistory);

  
  
  const [inputValue, setInputValue] = useState(currentQuery);

  useEffect(() => {
    if (inputValue !== '') {
      handleSearch(inputValue);
    }
  }, [inputValue]);

  const handleSearch = (value: string) => {
    if (value.trim()) {
      dispatch(setCurrentQuery(value.trim()));
      onSearch(value.trim());
    }
  };

  const handleClear = () => {
    setInputValue('');
    dispatch(setCurrentQuery(''));
    dispatch(clearSearch());
  };

  const handleShowHistory = () => {
    if (onShowHistory) {
      onShowHistory();
    }
  };

  return (
    <Space.Compact style={{ width: '100%' }}>
      <Search
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        // onSearch={handleSearch}
        loading={loading}
        allowClear
        // enterButton={
        //   <Button type="primary" icon={<SearchOutlined />}>
        //     Buscar
        //   </Button>
        // }
        style={{ flex: 1 }}
      />
      
      {hasHistory && (
        <Tooltip title="Ver historial">
          <Button
            icon={<HistoryOutlined />}
            onClick={handleShowHistory}
            type="text"
          />
        </Tooltip>
      )}
      
      {currentQuery && (
        <Tooltip title="Limpiar búsqueda">
          <Button
            icon={<ClearOutlined />}
            onClick={handleClear}
            type="text"
            danger
          />
        </Tooltip>
      )}
    </Space.Compact>
  );
};

export default SearchBar; 