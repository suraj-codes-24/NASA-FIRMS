import React from 'react';
import { AlertCircle, Flame, Sun, ArrowDown } from 'lucide-react';

const SeverityCard = ({ title, count, color, icon, isSelected }) => (
  <div className="glass-panel" style={{ 
    flex: 1, 
    padding: '16px 20px', 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    border: isSelected ? `2px solid ${color}` : '1px solid var(--border-color)',
    cursor: 'pointer',
    backgroundColor: isSelected ? `${color}10` : 'var(--bg-card)'
  }}>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '4px' }}>{title}</span>
      <span style={{ fontSize: '28px', fontWeight: 600, color: 'white' }}>{count}</span>
    </div>
    <div style={{ backgroundColor: `${color}20`, padding: '12px', borderRadius: '12px', color: color }}>
      {icon}
    </div>
  </div>
);

const AlertSeverityRow = () => {
  return (
    <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
      <SeverityCard title="Critical" count="3" color="#ff4757" icon={<AlertCircle size={24} />} isSelected={true} />
      <SeverityCard title="High" count="8" color="#ffa502" icon={<Flame size={24} />} isSelected={false} />
      <SeverityCard title="Medium" count="15" color="#eccc68" icon={<Sun size={24} />} isSelected={false} />
      <SeverityCard title="Low" count="24" color="#1e90ff" icon={<ArrowDown size={24} />} isSelected={false} />
    </div>
  );
};

export default AlertSeverityRow;
