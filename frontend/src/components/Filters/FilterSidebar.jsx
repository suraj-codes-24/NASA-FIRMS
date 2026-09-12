import React, { useState } from 'react';
import { Filter, X, RotateCcw } from 'lucide-react';

const FIRE_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'Industrial Fire', label: '🔴 Industrial Fire' },
  { value: 'Forest Fire', label: '🟠 Forest / Wildfire' },
  { value: 'Gas Flare', label: '🟡 Gas Flare' },
  { value: 'Agricultural Burn', label: '🟢 Agricultural Burn' },
  { value: 'Mining/Thermal', label: '🔵 Mining / Thermal' },
  { value: 'Unclassified', label: '⚪ Unclassified' },
];

/**
 * Filter sidebar for the map dashboard.
 * Supports date range, fire type, confidence slider, and region.
 */
export default function FilterSidebar({ filters = {}, onFilterChange, onClose }) {
  const [localFilters, setLocalFilters] = useState({
    startDate: filters.startDate || '',
    endDate: filters.endDate || '',
    classification: filters.classification || '',
    minConfidence: filters.minConfidence || 0,
    ...filters,
  });

  const update = (key, value) => {
    const next = { ...localFilters, [key]: value };
    setLocalFilters(next);
    if (onFilterChange) onFilterChange(next);
  };

  const reset = () => {
    const empty = { startDate: '', endDate: '', classification: '', minConfidence: 0 };
    setLocalFilters(empty);
    if (onFilterChange) onFilterChange(empty);
  };

  const inputStyle = {
    width: '100%', padding: '0.6rem 0.75rem', borderRadius: 8,
    border: '1px solid var(--border)', background: 'rgba(255,255,255,0.05)',
    color: 'var(--text-primary)', fontSize: '0.85rem', outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500,
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6, display: 'block',
  };

  return (
    <div className="glass-card" style={{ padding: '1.25rem', width: 260 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
          <Filter size={16} /> Filters
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={reset} title="Reset" style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <RotateCcw size={14} />
          </button>
          {onClose && (
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Date Range */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={labelStyle}>Start Date</label>
        <input type="date" value={localFilters.startDate} onChange={e => update('startDate', e.target.value)} style={inputStyle} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label style={labelStyle}>End Date</label>
        <input type="date" value={localFilters.endDate} onChange={e => update('endDate', e.target.value)} style={inputStyle} />
      </div>

      {/* Fire Type */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={labelStyle}>Classification</label>
        <select value={localFilters.classification} onChange={e => update('classification', e.target.value)} style={inputStyle}>
          {FIRE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>

      {/* Confidence Slider */}
      <div style={{ marginBottom: '0.5rem' }}>
        <label style={labelStyle}>Min Confidence: {localFilters.minConfidence}%</label>
        <input
          type="range" min={0} max={100} value={localFilters.minConfidence}
          onChange={e => update('minConfidence', Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--accent)' }}
        />
      </div>
    </div>
  );
}
