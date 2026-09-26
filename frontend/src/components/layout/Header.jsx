import React from 'react';
import { useLocation } from 'react-router-dom';
import { Search, Bell, User } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  // Fetch user from local storage
  let user = { full_name: 'Admin Analyst', role: 'NTRO Security' }; // defaults
  try {
    const storedUser = localStorage.getItem('ignis_user');
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  } catch (e) {
    console.error("Failed to parse user", e);
  }

  // Formatting role
  const roleDisplay = user.role === 'admin' ? 'System Administrator' : 'Analyst';

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
        <button style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}>
          <Bell size={16} />
          <div style={{ position: 'absolute', top: '8px', right: '8px', width: '6px', height: '6px', backgroundColor: '#ef4444', borderRadius: '50%', boxShadow: '0 0 5px rgba(239, 68, 68, 0.8)' }}></div>
        </button>
        
        <div className="user-widget" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '8px', padding: '6px 12px', borderRadius: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'background 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'white', display: 'flex', alignItems: 'center' }}>
              {user.full_name}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', letterSpacing: '0.3px', marginTop: '2px', textTransform: 'capitalize' }}>{roleDisplay}</span>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg, #00a8ff, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 2px 10px rgba(0, 168, 255, 0.3)' }}>
              <User size={16} strokeWidth={2.5} />
            </div>
            <div style={{ position: 'absolute', bottom: '0px', right: '0px', width: '10px', height: '10px', backgroundColor: '#2ed573', borderRadius: '50%', border: '2px solid var(--bg-main)', boxShadow: '0 0 5px rgba(46, 213, 115, 0.5)' }}></div>
          </div>
        </div>
      </div>

    </header>
  );
};

export default Header;
