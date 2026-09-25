import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, User } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname === '/') return 'Map Dashboard';
    if (location.pathname === '/analytics') return 'Fire Detection Analytics';
    if (location.pathname === '/alerts') return 'Alerts Management';
    if (location.pathname === '/reports') return 'System Reports';
    if (location.pathname === '/settings') return 'System Settings';
    if (location.pathname.startsWith('/hotspot/')) return 'Anomaly Intelligence';
    return 'IGNIS Dashboard';
  };

  return (
    <header className="app-header" style={{ padding: '0 2rem', height: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      
      {/* Dynamic Page Title */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white', margin: 0, letterSpacing: '0.5px' }}>
          {getPageTitle()}
        </h2>
      </div>

      {/* Empty Center for spacing */}
      <div style={{ flex: 1 }}></div>

      {/* Right Icons & User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', cursor: 'pointer' }}>
          <Bell size={16} />
        </button>
        
        <div className="user-widget" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '8px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'white' }}>Admin Analyst</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>NTRO Security</span>
          </div>
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(90deg, #9b51e0, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <User size={18} />
          </div>
        </div>
      </div>

    </header>
  );
};

export default Header;
