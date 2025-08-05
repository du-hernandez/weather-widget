import React from 'react';
import { MapWrapper } from '@features/map/components/MapWrapper';

const MapSection: React.FC = () => {
  return (
    <div style={{ gridArea: 'map' }}>
      <MapWrapper />
    </div>
  );
};

export default MapSection; 