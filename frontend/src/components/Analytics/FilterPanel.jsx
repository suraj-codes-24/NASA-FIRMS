import React from 'react';

const FilterPanel = () => {
  return (
    <div className="glass-panel" style={{ width: '280px', display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
      
      {/* Date Range */}
      <div>
        <h4 style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Date Range</h4>
        <div style={{ backgroundColor: 'rgba(0,0,0,0.3)', padding: '10px 15px', borderRadius: '6px', fontSize: '13px', marginBottom: '15px' }}>
          Oct 1, 2023 - Oct 14, 2023
        </div>
        <input type="range" min="1" max="14" defaultValue="14" style={{ width: '100%', accentColor: '#1e90ff' }} />
      </div>

      {/* Fire Types */}
      <div>
        <h4 style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Fire Types</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked style={{ accentColor: '#1e90ff' }} /> Industrial Fires
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked style={{ accentColor: '#1e90ff' }} /> Forest Fires
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked style={{ accentColor: '#1e90ff' }} /> Gas Flares
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', cursor: 'pointer' }}>
            <input type="checkbox" defaultChecked style={{ accentColor: '#1e90ff' }} /> Agricultural Burns
          </label>
        </div>
      </div>

      {/* Confidence Slider */}
      <div>
        <h4 style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Confidence Slider</h4>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
          <span>0% - 100%</span>
          <span style={{ color: 'white', fontWeight: 600 }}>75%</span>
        </div>
        <input type="range" min="0" max="100" defaultValue="75" style={{ width: '100%', accentColor: '#1e90ff' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Region */}
      <div>
        <h4 style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>Region</h4>
        <select className="input-field" style={{ width: '100%', padding: '10px', backgroundColor: 'rgba(0,0,0,0.3)' }}>
          <option>India - All States</option>
          <option>Gujarat</option>
          <option>Assam</option>
          <option>Punjab</option>
        </select>
      </div>

    </div>
  );
};

export default FilterPanel;
