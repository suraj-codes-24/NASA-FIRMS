import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Grid, 
  Map as MapIcon, 
  BarChart2, 
  FileText, 
  Settings, 
  LogOut,
  HelpCircle,
  Flame
} from 'lucide-react';

const Sidebar = () => {
  return (
    <nav className="app-sidebar">
      <a href="/" style={{ textDecoration: 'none' }}>
        <div className="sidebar-logo" style={{ cursor: 'pointer' }}>
          <div style={{width: '28px', height: '28px', background: 'linear-gradient(90deg, #9b51e0 0%, #3b82f6 100%)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Flame size={16} color="white" />
          </div>
          <span>IGNIS</span>
        </div>
      </a>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%' }}>
        
        <div className="sidebar-section">Surveillance</div>
        <NavLink to="/" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <Grid size={18} />
          <span className="nav-label">Map Dashboard</span>
        </NavLink>
        
        <NavLink to="/alerts" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <MapIcon size={18} />
          <span className="nav-label">Live Alerts</span>
        </NavLink>

        <div className="sidebar-section">Intelligence</div>
        <NavLink to="/analytics" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <BarChart2 size={18} />
          <span className="nav-label">Analytics</span>
        </NavLink>

        <NavLink to="/reports" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <FileText size={18} />
          <span className="nav-label">Reports</span>
        </NavLink>

        <div className="sidebar-section">System</div>
        <NavLink to="/settings" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
          <Settings size={18} />
          <span className="nav-label">Settings</span>
        </NavLink>
      </div>

      <div style={{ width: '100%', padding: '1rem 0' }}>
        <a href="#" className="nav-item">
          <HelpCircle size={18} />
          <span className="nav-label">Help & Support</span>
        </a>
        <a href="#" className="nav-item" style={{ marginTop: '0.25rem' }}>
          <LogOut size={18} />
          <span className="nav-label">Log Out</span>
        </a>
      </div>
    </nav>
  );
};

export default Sidebar;
