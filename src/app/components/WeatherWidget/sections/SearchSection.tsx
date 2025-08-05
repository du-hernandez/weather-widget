import React, { useMemo } from 'react';
import SearchBar from '@features/search/components/SearchBar';
import SearchSuggestions from '@features/search/components/SearchSuggestions';
import { useWeatherLoading } from '@shared/hooks/useLoading';

interface SearchSectionProps {
  onSearch: (query: string) => void;
  onSelectSuggestion: (suggestion: any) => void;
  onFocus: () => void;
  onBlur: () => void;
  showSuggestions: boolean;
  currentQuery: string;
}

const SearchSection: React.FC<SearchSectionProps> = ({
  onSearch,
  onSelectSuggestion,
  onFocus,
  onBlur,
  showSuggestions,
  currentQuery,
}) => {
  const { isLoading } = useWeatherLoading();

  // Memoizar props del SearchBar
  const searchBarProps = useMemo(() => ({
    onSearch,
    loading: isLoading,
    placeholder: "Buscar ciudad...",
    onFocus,
    onBlur
  }), [onSearch, isLoading, onFocus, onBlur]);

  // Memoizar props del SearchSuggestions
  const searchSuggestionsProps = useMemo(() => ({
    query: currentQuery,
    onSelectSuggestion,
    visible: showSuggestions
  }), [currentQuery, onSelectSuggestion, showSuggestions]);

  return (
    <>
      {/* Barra de búsqueda - Grid Area: search */}
      <div style={{ gridArea: 'search' }}>
        <div className="glass-effect search-panel" style={{ padding: '16px', position: 'relative' }}>
          <SearchBar {...searchBarProps} />
        </div>
      </div>

      {/* SearchSuggestions fuera del contenedor para contexto de apilamiento independiente */}
      {showSuggestions && currentQuery && (
        <SearchSuggestions {...searchSuggestionsProps} />
      )}
    </>
  );
};

export default SearchSection; 