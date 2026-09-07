import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchHotspots } from '../../api';

const HeatMap = () => {
  const [position, setPosition] = useState([22.0, 79.0]); // Center of India
  const [hotspots, setHotspots] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchHotspots(500); // Fetch up to 500 points for the map
      setHotspots(data);
    };
    loadData();
    const interval = setInterval(loadData, 15000); // Refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const getColor = (label) => {
    if (label === 'INDUSTRIAL_FIRE') return '#ff4757'; // Red
    if (label === 'FOREST_FIRE') return '#ffa502'; // Orange
    if (label === 'GAS_FLARE') return '#eccc68'; // Yellow
    if (label === 'AGRICULTURAL') return '#2ed573'; // Green
    return '#a4b0be'; // Unknown
  };

  return (
    <div className="glass-panel" style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
      <MapContainer center={position} zoom={5} style={{ height: '100%', width: '100%' }} zoomControl={true}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        {/* Simulate heatmap effect with blurred circles */}
        {hotspots.map((pt, i) => {
          const color = getColor(pt.ml_label);
          // Scale intensity slightly based on FRP if available, else default to 20
          const intensity = Math.min(Math.max(pt.frp ? pt.frp / 10 : 20, 10), 40);
          return (
            <React.Fragment key={i}>
              {/* Inner Circle */}
              <CircleMarker
                center={[pt.latitude, pt.longitude]}
                radius={intensity}
                pathOptions={{
                  color: 'transparent',
                  fillColor: color,
                  fillOpacity: 0.6,
                }}
              />
              {/* Outer Glow */}
              <CircleMarker
                center={[pt.latitude, pt.longitude]}
                radius={intensity * 2}
                pathOptions={{
                  color: 'transparent',
                  fillColor: color,
                  fillOpacity: 0.15,
                }}
              />
              {/* Pin */}
              <CircleMarker
                center={[pt.latitude, pt.longitude]}
                radius={4}
                pathOptions={{
                  color: '#000',
                  weight: 2,
                  fillColor: color,
                  fillOpacity: 1,
                }}
              />
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Map Overlay info */}
      <div style={{ position: 'absolute', bottom: '10px', right: '10px', zIndex: 1000, fontSize: '10px', color: 'rgba(255,255,255,0.5)' }}>
        Map data ©2023 Carto, OpenStreetMap contributors.
      </div>
    </div>
  );
};

export default HeatMap;
