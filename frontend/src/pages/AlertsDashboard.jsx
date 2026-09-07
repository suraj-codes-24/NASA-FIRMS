import React from 'react';
import AlertSeverityRow from '../components/alerts/AlertSeverityRow';
import AlertsTable from '../components/alerts/AlertsTable';
import AlertDetailPane from '../components/alerts/AlertDetailPane';

const AlertsDashboard = () => {
  return (
    <div style={{ height: '100%', width: '100%', padding: '20px', display: 'flex', gap: '20px', overflow: 'hidden' }}>
      
      {/* Left Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>
        
        {/* Severity Breakdown */}
        <AlertSeverityRow />

        {/* Filter Bar */}
        <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, width: '100px' }}>FILTER BAR</span>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
             <input type="text" className="input-field" placeholder="Search Alerts..." style={{ width: '200px' }} />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Type Filter</span>
            <select className="input-field" style={{ width: '150px' }}><option>All Types</option></select>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Severity Filter</span>
            <select className="input-field" style={{ width: '150px' }}><option>All Severities</option></select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Date Range</span>
            <input type="text" className="input-field" placeholder="Date Range" style={{ width: '150px' }} />
          </div>

          <button className="btn btn-primary" style={{ marginLeft: 'auto', alignSelf: 'flex-end', height: '36px' }}>Generate Report</button>
        </div>

        {/* Alerts Table */}
        <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '16px 0', overflow: 'hidden' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '16px', paddingLeft: '20px' }}>RECENT ALERTS</h4>
          <AlertsTable />
        </div>

      </div>

      {/* Right Details Pane */}
      <AlertDetailPane />
      
    </div>
  );
};

export default AlertsDashboard;
