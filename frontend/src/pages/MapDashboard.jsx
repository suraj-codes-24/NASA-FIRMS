import React from 'react';
import SatelliteMap from '../components/map/SatelliteMap';
import ClassificationDetails from '../components/dashboard/ClassificationDetails';
import BottomCharts from '../components/dashboard/BottomCharts';

const MapDashboard = () => {
  return (
    <div style={{ height: '100%', width: '100%', position: 'relative', overflow: 'hidden' }}>
      <SatelliteMap />
      <ClassificationDetails />
      <BottomCharts />
    </div>
  );
};

export default MapDashboard;
