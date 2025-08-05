import React, { useMemo } from 'react';
import RecentSearchesPanel from '@features/search/components/RecentSearchesPanel';
import type { SearchResult } from '@features/search/types';

interface HistorySectionProps {
  onSelectSearch: (city: SearchResult) => void;
  onClearHistory: () => void;
}

const HistorySection: React.FC<HistorySectionProps> = ({
  onSelectSearch,
  onClearHistory,
}) => {
  // Memoizar props del RecentSearchesPanel
  const recentSearchesProps = useMemo(() => ({
    onSelectSearch,
    onClearHistory
  }), [onSelectSearch, onClearHistory]);

  return (
    <div style={{ gridArea: 'history' }}>
      <RecentSearchesPanel {...recentSearchesProps} />
    </div>
  );
};

export default HistorySection; 