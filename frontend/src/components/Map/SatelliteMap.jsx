import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { fetchHotspots } from '../../api';
import MarkerClusterGroup from './MarkerClusterGroup';
import { useSettings } from '../../contexts/SettingsContext';
import HeatmapLayer from './HeatmapLayer';

const ZoomTracker = ({ onZoomChange }) => {
  const map = useMapEvents({
    zoomend: () => onZoomChange(map.getZoom()),
  });
  return null;
};

const HotspotFocus = ({ hotspot }) => {
  const map = useMap();
  useEffect(() => {
    // Auto-zoom disabled per user request
    // if (hotspot) {
    //   map.flyTo([hotspot.latitude, hotspot.longitude], 15, { duration: 1.2 });
    // }
  }, [hotspot, map]);
  return null;
};

// Create a glowing, pulsing orb icon based on classification
const createCustomIcon = (color, isIndustrial, zoom = 13) => {
  const pulseClass = isIndustrial ? 'pulse-ring' : '';
  
  // Calculate size based on zoom.
  // Shrink significantly when zoomed out to reduce overlap.
  let outerSize = 16;
  let innerSize = 10;
  let shadowSpread = isIndustrial ? '12px' : '6px';

  if (zoom <= 5) {
    outerSize = 4; innerSize = 2; shadowSpread = '0px';
  } else if (zoom <= 8) {
    outerSize = 6; innerSize = 4; shadowSpread = '2px';
  } else if (zoom <= 11) {
    outerSize = 10; innerSize = 6; shadowSpread = '4px';
  } else if (zoom >= 15) {
    outerSize = 20; innerSize = 14; shadowSpread = isIndustrial ? '16px' : '8px';
  }

  const hitAreaSize = 24; // Ensure the clickable hitbox is always large enough

  return L.divIcon({
    className: 'custom-icon',
    html: `
      <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; cursor: pointer;">
        <div style="position: relative; width: ${outerSize}px; height: ${outerSize}px; display: flex; align-items: center; justify-content: center;">
          <div class="${pulseClass}" style="position: absolute; width: 100%; height: 100%; border: 2px solid ${color}; border-radius: 50%;"></div>
          <div style="background-color: ${color}; width: ${innerSize}px; height: ${innerSize}px; border-radius: 50%; box-shadow: 0 0 ${shadowSpread} ${color};"></div>
        </div>
      </div>
    `,
    iconSize: [hitAreaSize, hitAreaSize],
    iconAnchor: [hitAreaSize / 2, hitAreaSize / 2]
  });
};

const SatelliteMap = ({ activeFilters, onFilterChange, selectedHotspot, onSelectHotspot }) => {
  const [position, setPosition] = useState([22.0, 79.0]); // Center of India
  const [hotspots, setHotspots] = useState([]);
  const [showLabels, setShowLabels] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(5);
  const { settings } = useSettings();

  const useClustering = false;
  const showBuffers = settings?.settings_map_buffers !== 'false';
  const showHeatmap = settings?.settings_map_heatmap === 'true';

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchHotspots();
        setHotspots(data);
        // Map will now always start at the default India view instead of auto-centering.
      } catch (e) {
        console.error("Failed to load hotspots", e);
      }
    };
    loadData();
    
    // Poll every 10 seconds
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const getColorForLabel = (label) => {
    if (label === 'Industrial Fire' || label === 'INDUSTRIAL_FIRE') return '#ef4444'; // Neon Red/Pink
    if (label === 'Forest Fire' || label === 'FOREST_FIRE') return '#f97316'; // Orange
    if (label === 'Gas Flare' || label === 'GAS_FLARE') return '#eab308'; // Yellow
    if (label === 'Agricultural Burn' || label === 'AGRICULTURAL_BURN') return '#10b981'; // Cyan
    if (label === 'Mining Activity' || label === 'Mining/Thermal' || label === 'MINING_THERMAL') return '#3b82f6'; // Purple
    return '#9ca3af'; // Unknown
  };

  const visibleHotspots = hotspots.filter(h => 
    activeFilters.length === 0 || activeFilters.includes(h.ml_label)
  );

  const handleFilterClick = (label) => {
    if (activeFilters.includes(label)) {
      onFilterChange(activeFilters.filter(f => f !== label));
    } else {
      onFilterChange([...activeFilters, label]);
    }
    onSelectHotspot(null);
  };

  return (
    <div style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1, backgroundColor: '#050810' }}>
      {/* Tactical Grid Overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        pointerEvents: 'none',
        backgroundImage: 'linear-gradient(var(--border-color) 1px, transparent 1px), linear-gradient(90deg, var(--border-color) 1px, transparent 1px)',
        backgroundSize: '100px 100px',
        opacity: 0.15,
        zIndex: 500
      }} />
      <MapContainer center={position} zoom={5} style={{ height: '100%', width: '100%' }} zoomControl={false} scrollWheelZoom={true}>
        <ZoomTracker onZoomChange={setZoomLevel} />
        <HotspotFocus hotspot={selectedHotspot} />
        {/* ArcGIS Dark Gray Canvas Base View */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ"
        />
        {/* ArcGIS Dark Gray Canvas Labels */}
        {showLabels && (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
          />
        )}
        
        {/* Facility Marker (Blue) */}
        <Marker position={[22.3, 73.1]} icon={L.divIcon({
            className: 'facility-icon',
            html: `<div style="background-color: #00a8ff; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px #00a8ff;"></div>`,
            iconSize: [14, 14],
            iconAnchor: [7, 7]
        })} />
        {showBuffers && (
          <Circle center={[22.3, 73.1]} radius={2000} pathOptions={{ color: '#00a8ff', fillColor: '#00a8ff', fillOpacity: 0.1, weight: 1, dashArray: '5,5' }} />
        )}
        
        {/* Heatmap Layer */}
        {showHeatmap && <HeatmapLayer points={visibleHotspots} />}
        
        {/* Dynamic Hotspots */}
        {useClustering ? (
          <MarkerClusterGroup
            chunkedLoading
            maxClusterRadius={20}
            iconCreateFunction={(cluster) => {
              return L.divIcon({
                html: `<div class="cluster-marker">${cluster.getChildCount()}</div>`,
                className: 'custom-cluster-icon',
                iconSize: L.point(40, 40, true),
              });
            }}
          >
            {visibleHotspots.map((h, i) => (
              <Marker 
                key={i} 
                position={[h.latitude, h.longitude]} 
                icon={createCustomIcon(getColorForLabel(h.ml_label), h.ml_label === 'Industrial Fire', zoomLevel)}
                zIndexOffset={selectedHotspot && selectedHotspot.id === h.id ? 1000 : 0}
                eventHandlers={{
                  click: () => onSelectHotspot(h),
                }}
              />
            ))}
          </MarkerClusterGroup>
        ) : (
          <React.Fragment>
            {visibleHotspots.map((h, i) => (
              <Marker 
                key={i} 
                position={[h.latitude, h.longitude]} 
                icon={createCustomIcon(getColorForLabel(h.ml_label), h.ml_label === 'Industrial Fire', zoomLevel)}
                zIndexOffset={selectedHotspot && selectedHotspot.id === h.id ? 1000 : 0}
                eventHandlers={{
                  click: () => onSelectHotspot(h),
                }}
              />
            ))}
          </React.Fragment>
        )}
        
        {/* Sleek Custom Legend / Filter */}
        <div className="glass-panel" style={{ 
          position: 'absolute', bottom: '40px', left: '20px', zIndex: 1000, padding: '16px', 
          color: 'var(--text-primary)', minWidth: '180px', backgroundColor: 'var(--bg-card)', 
          borderRadius: '12px', border: '1px solid var(--border-color)', 
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)' 
        }}>
          <h4 style={{margin: '0 0 12px 0', fontSize: '13px', fontWeight: '600', letterSpacing: '1px', color: 'var(--text-secondary)'}}>
            MAP LAYERS
          </h4>
          
          {[
            { label: 'Industrial Fire', color: '#ef4444', shadow: '0 0 8px #ef4444' },
            { label: 'Gas Flare', color: '#eab308', shadow: '0 0 6px #eab308' },
            { label: 'Forest Fire', color: '#f97316', shadow: 'none' },
            { label: 'Agricultural Burn', color: '#10b981', shadow: 'none' },
            { label: 'Mining Activity', color: '#3b82f6', shadow: 'none' },
            { label: 'Unclassified', color: '#9ca3af', shadow: 'none' }
          ].map((item) => {
            const isActive = activeFilters.length === 0 || activeFilters.includes(item.label);
            return (
              <div 
                key={item.label}
                onClick={() => handleFilterClick(item.label)}
                style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  marginBottom: '10px', 
                  fontSize: '12px',
                  cursor: 'pointer',
                  opacity: isActive ? 1 : 0.3,
                  transition: 'opacity 0.2s ease'
                }}
              >
                <div style={{
                  width:'10px', height:'10px', borderRadius:'50%', 
                  backgroundColor: item.color, 
                  boxShadow: isActive ? item.shadow : 'none'
                }}></div> 
                {item.label}
              </div>
            );
          })}
          
          <div style={{display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px', marginTop: '4px', opacity: activeFilters.length === 0 ? 1 : 0.3}}>
            <div style={{width:'10px', height:'10px', borderRadius:'2px', backgroundColor:'#00a8ff', border: '1px solid rgba(255,255,255,0.3)'}}></div> Known Facility
          </div>
          
          {/* Map Labels Toggle */}
          <div 
            onClick={() => setShowLabels(!showLabels)}
            style={{
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '8px', 
              marginTop: '12px', 
              padding: '8px 10px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: showLabels ? 'rgba(0, 168, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
              border: showLabels ? '1px solid rgba(0, 168, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              color: showLabels ? '#00a8ff' : 'var(--text-secondary)'
            }}
          >
            {showLabels ? 'Hide Map Labels' : 'Show Map Labels'}
          </div>
        </div>
      </MapContainer>
    </div>
  );
};

export default SatelliteMap;
