import React from 'react';
import { MapPin } from 'lucide-react';

const mockAlerts = [
  { id: 'AFD-3049', type: 'INDUSTRIAL FIRE', loc: 'New Shakthar', state: 'Siraaa (Country)', frp: 2800, conf: 86, time: '13:26:38 AM', status: 'Active' },
  { id: 'AFD-3048', type: 'INDUSTRIAL FIRE', loc: 'Industrial Fire', state: 'Siraan (Country)', frp: 3300, conf: 80, time: '12:25:11 AM', status: 'Resolved' },
  { id: 'AFD-3047', type: 'FOREST FIRE', loc: 'New Boligawi', state: 'Siraan (Country)', frp: 3600, conf: 80, time: '12:26:38 AM', status: 'Active' },
  { id: 'AFD-3046', type: 'GAS FLARE', loc: 'Gas Flare', state: 'Snaan (Country)', frp: 12.0, conf: 25, time: '12:25:14 AM', status: 'Resolved' },
  { id: 'AFD-3045', type: 'INDUSTRIAL FIRE', loc: 'Industrial Fire', state: 'Snaan (Country)', frp: 5020, conf: 80, time: '12:25:13 AM', status: 'Resolved' },
  { id: 'AFD-3044', type: 'FOREST FIRE', loc: 'Forest Tinown', state: 'Snaan (Country)', frp: 3000, conf: 80, time: '12:25:15 AM', status: 'Resolved' },
  { id: 'AFD-3043', type: 'GAS FLARE', loc: 'New Boligawi', state: 'Snaan (Country)', frp: 1.50, conf: 36, time: '12:25:15 AM', status: 'Resolved' },
  { id: 'AFD-3042', type: 'GAS FLARE', loc: 'Gas Flare', state: 'Snaan (Country)', frp: 12.0, conf: 25, time: '12:25:15 AM', status: 'Resolved' },
  { id: 'AFD-3040', type: 'GAS FLARE', loc: 'Industrial Fire', state: 'Snaan (Country)', frp: 2800, conf: 80, time: '12:25:15 AM', status: 'Resolved' },
];

const getTypeStyle = (type) => {
  if (type === 'INDUSTRIAL FIRE') return { bg: '#ff475720', border: '#ff4757', color: '#ff4757' };
  if (type === 'FOREST FIRE') return { bg: '#ffa50220', border: '#ffa502', color: '#ffa502' };
  if (type === 'GAS FLARE') return { bg: '#eccc6820', border: '#eccc68', color: '#eccc68' };
  return { bg: '#a4b0be20', border: '#a4b0be', color: '#a4b0be' };
};

const AlertsTable = () => {
  return (
    <div style={{ flex: 1, overflowY: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
        <thead style={{ position: 'sticky', top: 0, backgroundColor: 'var(--bg-card-solid)', zIndex: 10 }}>
          <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
            <th style={{ padding: '12px', width: '40px' }}><input type="checkbox" style={{ accentColor: '#1e90ff' }} /></th>
            <th style={{ padding: '12px' }}>Alert ID ^</th>
            <th style={{ padding: '12px' }}>Type ^</th>
            <th style={{ padding: '12px' }}>Location</th>
            <th style={{ padding: '12px' }}>State (Country) ^</th>
            <th style={{ padding: '12px' }}>FRP ^</th>
            <th style={{ padding: '12px' }}>Confidence (%)</th>
            <th style={{ padding: '12px' }}>Time ^</th>
            <th style={{ padding: '12px' }}>Status ^</th>
          </tr>
        </thead>
        <tbody>
          {mockAlerts.map((alert, index) => {
            const isSelected = alert.id === 'AFD-3048';
            const typeStyle = getTypeStyle(alert.type);
            return (
              <tr key={index} style={{ 
                borderBottom: '1px solid rgba(255,255,255,0.05)', 
                backgroundColor: isSelected ? 'rgba(30, 144, 255, 0.15)' : 'transparent',
                borderLeft: isSelected ? '3px solid #1e90ff' : '3px solid transparent',
                cursor: 'pointer'
              }}>
                <td style={{ padding: '12px' }}>
                  <input type="checkbox" checked={isSelected} readOnly style={{ accentColor: '#1e90ff' }} />
                </td>
                <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{alert.id}</td>
                <td style={{ padding: '12px' }}>
                  <span style={{ 
                    padding: '4px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: 600,
                    backgroundColor: typeStyle.bg, border: `1px solid ${typeStyle.border}`, color: typeStyle.color
                  }}>
                    {alert.type}
                  </span>
                </td>
                <td style={{ padding: '12px', display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
                  <MapPin size={14} /> {alert.loc}
                </td>
                <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{alert.state}</td>
                <td style={{ padding: '12px' }}>{alert.frp}</td>
                <td style={{ padding: '12px' }}>{alert.conf}</td>
                <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{alert.time}</td>
                <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{alert.status}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AlertsTable;
