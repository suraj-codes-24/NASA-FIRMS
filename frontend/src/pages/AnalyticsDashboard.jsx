import React from 'react';
import StatCards from '../components/analytics/StatCards';
import FilterPanel from '../components/analytics/FilterPanel';
import HeatMap from '../components/analytics/HeatMap';
import RecentAlertsTimeline from '../components/analytics/RecentAlertsTimeline';
import FrequencyChart from '../components/analytics/FrequencyChart';

const AnalyticsDashboard = () => {
  return (
    <div style={{ height: '100%', width: '100%', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
      
      <StatCards />

      <div style={{ flex: 1, display: 'flex', gap: '20px', minHeight: '400px' }}>
        <FilterPanel />
        <HeatMap />
        <RecentAlertsTimeline />
      </div>
      
      <FrequencyChart />
      
    </div>
  );
};

export default AnalyticsDashboard;
