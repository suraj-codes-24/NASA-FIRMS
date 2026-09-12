import React, { useState, useEffect } from 'react';
import { Flame, Factory, TreePine, Droplets, AlertTriangle } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/v1';

const StatCard = ({ title, value, icon, color }) => (
  <div className="glass-panel" style={{ flex: 1, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px', borderTop: `2px solid ${color}` }}>
    <div style={{ backgroundColor: `${color}20`, padding: '12px', borderRadius: '12px', color: color }}>
      {icon}
    </div>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 500 }}>{title}</span>
      <span style={{ fontSize: '24px', fontWeight: 600, color: 'white' }}>{value !== null ? value.toLocaleString() : '—'}</span>
    </div>
  </div>
);

const StatCards = () => {
  const [stats, setStats] = useState({
    total: null,
    industrial: null,
    forest: null,
    gasFlare: null,
    alerts: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [summaryRes, classRes] = await Promise.all([
          axios.get(`${API_BASE}/analytics/summary`),
          axios.get(`${API_BASE}/analytics/classification`),
        ]);
        
        const summary = summaryRes.data;
        const classes = classRes.data;

        const getCount = (label) => {
          const item = classes.find(c => c.label === label);
          return item ? item.count : 0;
        };

        setStats({
          total: summary.total_hotspots,
          industrial: getCount('Industrial Fire'),
          forest: getCount('Forest Fire'),
          gasFlare: getCount('Gas Flare'),
          alerts: summary.high_severity_alerts,
        });
      } catch (err) {
        console.error('Failed to load stat cards:', err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: 'flex', gap: '1rem', width: '100%', marginBottom: '1rem' }}>
      <StatCard title="Total Hotspots" value={stats.total} icon={<Flame size={24} />} color="#ff6b81" />
      <StatCard title="Industrial Fires" value={stats.industrial} icon={<Factory size={24} />} color="#ff4757" />
      <StatCard title="Forest Fires" value={stats.forest} icon={<TreePine size={24} />} color="#ffa502" />
      <StatCard title="Gas Flares" value={stats.gasFlare} icon={<Droplets size={24} />} color="#eccc68" />
      <StatCard title="Active Alerts" value={stats.alerts} icon={<AlertTriangle size={24} />} color="#ff4757" />
    </div>
  );
};

export default StatCards;
