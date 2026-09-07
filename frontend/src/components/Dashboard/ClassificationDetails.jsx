import React from 'react';
import { Flame, CheckCircle, Navigation, Map as MapIcon, Clock, ShieldCheck, ChevronUp } from 'lucide-react';

const ClassificationDetails = () => {
  return (
    <div className="glass-panel" style={{ width: '340px', position: 'absolute', top: '20px', right: '20px', zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
      
      {/* Header */}
      <div style={{ backgroundColor: '#ff4757', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTopLeftRadius: '9px', borderTopRightRadius: '9px', color: 'white' }}>
        <span style={{ fontWeight: 600, fontSize: '13px', letterSpacing: '0.5px' }}>HOTSPOT CLASSIFICATION DETAILS:<br/>#HT-0034</span>
        <ChevronUp size={20} />
      </div>
      
      {/* Content */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '14px' }}>
        
        {/* Type Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <Flame size={16} /> Type
          </div>
          <span style={{ color: '#ff4757', fontWeight: 600 }}>Industrial Fire</span>
        </div>

        {/* Confidence Row */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
              <CheckCircle size={16} /> Confidence
            </div>
            <span style={{ fontWeight: 600 }}>94%</span>
          </div>
          <div style={{ width: '100%', height: '6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: '94%', height: '100%', backgroundColor: '#ff4757', borderRadius: '3px' }}></div>
          </div>
        </div>

        {/* FRP Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <Flame size={16} /> Fire Radiative Power (FRP)
          </div>
          <span style={{ fontWeight: 600 }}>287 MW</span>
        </div>

        {/* Brightness Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <div style={{width: 16, height: 16, borderRadius: '50%', border: '1.5px solid currentColor', display:'flex', alignItems:'center', justifyContent:'center', fontSize: 10}}>&#9728;</div> Brightness Temp
          </div>
          <span style={{ fontWeight: 600 }}>412.5 K</span>
        </div>

        {/* Nearest Facility Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <Navigation size={16} /> Nearest Facility
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontWeight: 600 }}>IOCL Refinery</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>(1.2 km SE)</span>
          </div>
        </div>

        {/* Land Cover Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <MapIcon size={16} /> Land Cover
          </div>
          <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap:'6px' }}>Industrial/Refinery <span style={{fontSize:'16px'}}>🏢</span></span>
        </div>

        {/* Persistence Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <Clock size={16} /> Persistence
          </div>
          <span style={{ fontWeight: 600 }}>72 hours</span>
        </div>

        {/* Status Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <ShieldCheck size={16} color="#2ed573" /> Status
          </div>
          <span style={{ fontWeight: 600, color: '#2ed573' }}>Active (Monitored)</span>
        </div>

      </div>
    </div>
  );
};

export default ClassificationDetails;
