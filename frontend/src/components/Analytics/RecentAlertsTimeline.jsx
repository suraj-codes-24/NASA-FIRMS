import React from 'react';

const AlertItem = ({ date, time, title, subtitle, color, number }) => (
  <div style={{ display: 'flex', gap: '15px', position: 'relative', marginBottom: '25px' }}>
    {/* Line connector */}
    <div style={{ position: 'absolute', left: '11px', top: '24px', bottom: '-25px', width: '2px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
    
    <div style={{ 
      width: '24px', height: '24px', borderRadius: '50%', border: `2px solid ${color}`, 
      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', 
      fontWeight: 'bold', color: color, backgroundColor: 'var(--bg-card)', zIndex: 2 
    }}>
      {number}
    </div>
    
    <div style={{ 
      flex: 1, backgroundColor: `${color}15`, border: `1px solid ${color}40`, 
      borderRadius: '8px', padding: '12px' 
    }}>
      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>{date}, {time}</div>
      <div style={{ fontSize: '13px', fontWeight: 500, color: 'white', marginBottom: '4px' }}>{title}</div>
      <div style={{ fontSize: '12px', color: color }}>[{subtitle}]</div>
    </div>
  </div>
);

const RecentAlertsTimeline = () => {
  return (
    <div className="glass-panel" style={{ width: '300px', display: 'flex', flexDirection: 'column', padding: '20px' }}>
      <h3 style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '20px' }}>Recent Alerts</h3>
      
      <div style={{ flex: 1, overflowY: 'auto', paddingRight: '5px' }}>
        <AlertItem 
          number="1"
          date="14 Oct" time="09:30 AM" 
          title="Forest Fire, Uttarakhand" 
          subtitle="High Severity, Orange" 
          color="#ffa502" 
        />
        <AlertItem 
          number="2"
          date="14 Oct" time="08:45 AM" 
          title="Industrial Fire, Gujarat" 
          subtitle="Medium Severity, Red" 
          color="#ff4757" 
        />
        <AlertItem 
          number="3"
          date="13 Oct" time="11:15 PM" 
          title="Gas Flare, Assam" 
          subtitle="Low Severity, Yellow" 
          color="#eccc68" 
        />
        <AlertItem 
          number="4"
          date="13 Oct" time="04:20 PM" 
          title="Agricultural Burn, Punjab" 
          subtitle="Low Severity, Green" 
          color="#2ed573" 
        />
      </div>
    </div>
  );
};

export default RecentAlertsTimeline;
