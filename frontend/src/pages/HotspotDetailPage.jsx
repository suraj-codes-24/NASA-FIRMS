import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Flame, Clock, Shield, Factory } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://localhost:8000/api/v1';

const classColors = {
  'Industrial Fire': '#ef4444',
  'Forest Fire': '#f97316',
  'Gas Flare': '#eab308',
  'Agricultural Burn': '#22c55e',
  'Mining/Thermal': '#3b82f6',
  'Unclassified': '#6b7280',
};

export default function HotspotDetailPage() {
  const { id } = useParams();
  const [hotspot, setHotspot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE}/hotspots/${id}`)
      .then(res => setHotspot(res.data))
      .catch(() => setHotspot(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-loading">Loading hotspot data…</div>;
  if (!hotspot) return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Hotspot #{id} not found</h2>
      <Link to="/" style={{ color: 'var(--accent)' }}>← Back to Map</Link>
    </div>
  );

  const label = hotspot.ml_label || 'Unclassified';
  const color = classColors[label] || '#6b7280';

  return (
    <div style={{ padding: '1.5rem', maxWidth: 900, margin: '0 auto' }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-secondary)', marginBottom: '1.5rem', textDecoration: 'none' }}>
        <ArrowLeft size={18} /> Back to Dashboard
      </Link>

      <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem' }}>
          <Flame size={28} color={color} />
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Hotspot #{hotspot.id}</h1>
          <span style={{
            padding: '4px 14px', borderRadius: 20, fontSize: '0.85rem', fontWeight: 600,
            background: `${color}22`, color: color, border: `1px solid ${color}44`,
          }}>
            {label}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
          <DetailItem icon={<MapPin size={16} />} label="Coordinates" value={`${hotspot.latitude?.toFixed(4)}, ${hotspot.longitude?.toFixed(4)}`} />
          <DetailItem icon={<Flame size={16} />} label="Brightness" value={hotspot.brightness?.toFixed(1)} />
          <DetailItem icon={<Flame size={16} />} label="FRP (MW)" value={hotspot.frp?.toFixed(2)} />
          <DetailItem icon={<Shield size={16} />} label="Confidence" value={`${hotspot.confidence?.toFixed(0)}%`} />
          <DetailItem icon={<Clock size={16} />} label="Acquired" value={hotspot.acq_date || '—'} />
          <DetailItem icon={<Factory size={16} />} label="Satellite" value={hotspot.satellite || '—'} />
          <DetailItem label="Instrument" value={hotspot.instrument || '—'} />
          <DetailItem label="Day/Night" value={hotspot.daynight === 'D' ? '☀ Day' : '🌙 Night'} />
          <DetailItem label="Classification Confidence" value={`${hotspot.classification_confidence?.toFixed(1) || 0}%`} />
          <DetailItem label="Distance to Industry" value={hotspot.dist_to_industry_m != null ? `${hotspot.dist_to_industry_m.toFixed(0)} m` : '—'} />
          <DetailItem label="Persistence" value={`${hotspot.persistence_hours?.toFixed(1) || 0} hrs`} />
          <DetailItem label="User Verified" value={hotspot.is_user_verified ? '✅ Yes' : '❌ No'} />
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 4 }}>
        {icon} {label}
      </span>
      <span style={{ fontSize: '1rem', fontWeight: 500 }}>{value ?? '—'}</span>
    </div>
  );
}
