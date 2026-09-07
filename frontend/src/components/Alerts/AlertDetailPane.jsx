import React from 'react';
import { X, MapPin, Navigation, UserCheck } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom red flame marker for mini map
const redIcon = L.divIcon({
  className: 'custom-icon',
  html: `<div style="background-color: #ff4757; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 0 10px #ff4757;">
           <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
         </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

const AlertDetailPane = () => {
  return (
    <div className="glass-panel" style={{ width: '360px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      
      {/* Header */}
      <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)' }}>
        <h3 style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '0.5px' }}>ALERT DETAILS</h3>
        <X size={18} style={{ cursor: 'pointer', color: 'var(--text-secondary)' }} />
      </div>

      {/* Scrollable Content */}
      <div style={{ padding: '20px', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>AFD-3049</h2>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Location<br/>
            lat/long: -21.785337, 30.983667
          </div>
        </div>

        {/* Mini Map */}
        <div style={{ height: '160px', borderRadius: '8px', overflow: 'hidden', position: 'relative' }}>
          <MapContainer center={[-21.785337, 30.983667]} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false} attributionControl={false}>
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            <Marker position={[-21.785337, 30.983667]} icon={redIcon} />
          </MapContainer>
        </div>

        {/* Timestamps */}
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          <div>Timestamps: 03:30:00</div>
          <div>Timestamps: 04:05:43</div>
        </div>

        {/* Description */}
        <div>
          <h4 style={{ fontSize: '13px', marginBottom: '4px', color: 'var(--text-secondary)' }}>Description</h4>
          <p style={{ fontSize: '13px' }}>Large storage tank fire, active, suppressing, and simire fire.</p>
        </div>

        {/* Status */}
        <div>
          <h4 style={{ fontSize: '13px', marginBottom: '8px', color: 'var(--text-secondary)' }}>Status</h4>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span style={{ backgroundColor: 'rgba(255,165,2,0.2)', color: '#ffa502', border: '1px solid #ffa502', padding: '4px 12px', borderRadius: '12px', fontSize: '12px' }}>Active</span>
            <span style={{ backgroundColor: 'rgba(30,144,255,0.2)', color: '#1e90ff', border: '1px solid #1e90ff', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <UserCheck size={14} /> Units 12, 14
            </span>
          </div>
        </div>

        {/* History */}
        <div>
          <h4 style={{ fontSize: '13px', marginBottom: '4px', color: 'var(--text-secondary)' }}>History</h4>
          <select className="input-field" style={{ width: '100%' }}>
            <option>View History...</option>
          </select>
        </div>

        {/* Notes */}
        <div style={{ flex: 1 }}>
          <h4 style={{ fontSize: '13px', marginBottom: '4px', color: 'var(--text-secondary)' }}>Notes</h4>
          <textarea className="input-field" style={{ width: '100%', height: '80px', resize: 'none' }}></textarea>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ padding: '16px 20px', display: 'flex', gap: '10px', borderTop: '1px solid var(--border-color)' }}>
        <button className="btn btn-primary" style={{ flex: 1.2 }}>Acknowledge</button>
        <button className="btn" style={{ flex: 1 }}>Manage</button>
        <button className="btn" style={{ flex: 1 }}>Close</button>
      </div>

    </div>
  );
};

export default AlertDetailPane;
