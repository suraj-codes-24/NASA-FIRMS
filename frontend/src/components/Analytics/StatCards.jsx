import React from 'react';
import { Flame, Factory, TreePine, Droplets, AlertTriangle } from 'lucide-react';

const StatCard = ({ title, value, icon, color }) => (
  <div className="glass-panel" style={{ flex: 1, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', borderTop: `2px solid ${color}` }}>
    <div style={{ backgroundColor: `${color}20`, padding: '12px', borderRadius: '12px', color: color }}>
      {icon}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>{title}</span>
      <span style={{ fontSize: '24px', fontWeight: 600, color: 'white' }}>{value}</span>
    </div>
  </div>
);

const StatCards = () => {
  return (
    <div style={{ display: 'flex', gap: '1rem', width: '100%', marginBottom: '1rem' }}>
      <StatCard title="Total Hotspots" value="1,247" icon={<Flame size={24} />} color="#ff6b81" />
      <StatCard title="Industrial Fires" value="89" icon={<Factory size={24} />} color="#ff4757" />
      <StatCard title="Forest Fires" value="342" icon={<TreePine size={24} />} color="#ffa502" />
      <StatCard title="Gas Flares" value="156" icon={<Droplets size={24} />} color="#eccc68" />
      <StatCard title="Alerts" value="12" icon={<AlertTriangle size={24} />} color="#ff4757" />
    </div>
  );
};

export default StatCards;
