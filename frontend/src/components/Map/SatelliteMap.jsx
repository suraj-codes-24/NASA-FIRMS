import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Flame } from 'lucide-react';
import { fetchHotspots } from '../../api';

// Custom icon using lucide-react (rendered to string/SVG)
const createCustomIcon = (color) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 0 10px ${color};">
             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
           </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const SatelliteMap = () => {
  const [position, setPosition] = useState([22.3, 73.1]); // Example coords (IOCL Refinery, Gujarat)
  const [hotspots, setHotspots] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchHotspots();
      setHotspots(data);
      if (data.length > 0) {
        setPosition([data[0].latitude, data[0].longitude]);
      }
    };
    loadData();
    
    // Poll every 10 seconds
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Helper to determine marker color
  const getColorForLabel = (label) => {
    if (label === 'INDUSTRIAL_FIRE') return '#ff4757'; // Red
    if (label === 'FOREST_FIRE') return '#ffa502'; // Orange
    if (label === 'GAS_FLARE') return '#eccc68'; // Yellow
    if (label === 'AGRICULTURAL') return '#2ed573'; // Green
    return '#a4b0be'; // Unknown
  };

  return (
    <div style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
      <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false}>
        {/* ESRI World Imagery for Satellite View */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
        />
        
        {/* Facility Marker (Blue) */}
        <Marker position={[22.3, 73.1]} icon={L.divIcon({
            className: 'facility-icon',
            html: `<div style="background-color: #1e90ff; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 8px #1e90ff;"></div>`,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        })}>
          <Popup>IOCL Refinery</Popup>
        </Marker>
        
        {/* Buffer Circle */}
        <Circle center={[22.3, 73.1]} radius={500} pathOptions={{ color: '#ffffff', weight: 1, fillOpacity: 0.1, dashArray: '5, 5' }} />
        <Circle center={[22.3, 73.1]} radius={200} pathOptions={{ color: '#ff4757', weight: 1, fillColor: '#ff4757', fillOpacity: 0.3 }} />

        {/* Dynamic Hotspots */}
        {hotspots.map((h, i) => (
          <Marker key={i} position={[h.latitude, h.longitude]} icon={createCustomIcon(getColorForLabel(h.ml_label))}>
            <Popup>
              <strong>{h.ml_label || 'UNCLASSIFIED'}</strong><br/>
              FRP: {h.frp} MW<br/>
              Confidence: {h.confidence}%<br/>
              Persistence: {h.persistence_hours || 0} hrs
            </Popup>
          </Marker>
        ))}
        
        
        {/* Custom Legend */}
        <div style={{ position: 'absolute', bottom: '280px', left: '20px', zIndex: 1000, background: 'var(--bg-card)', backdropFilter: 'blur(10px)', padding: '15px', borderRadius: '8px', border: '1px solid var(--border-color)', color: 'white' }}>
          <h4 style={{margin: '0 0 10px 0', fontSize: '14px'}}>Legend</h4>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '12px'}}>
            <div style={{width:'12px', height:'12px', borderRadius:'50%', backgroundColor:'#ff4757'}}></div> Active Fire
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '12px'}}>
            <div style={{width:'12px', height:'12px', borderRadius:'50%', backgroundColor:'#ffa502'}}></div> Managed Fire
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '12px'}}>
            <div style={{width:'12px', height:'12px', borderRadius:'50%', backgroundColor:'#1e90ff'}}></div> Facility
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px'}}>
            <div style={{width:'10px', height:'10px', borderRadius:'50%', border:'1px solid white'}}></div> Buffer
          </div>
        </div>
      </MapContainer>
    </div>
  );
};

export default SatelliteMap;
