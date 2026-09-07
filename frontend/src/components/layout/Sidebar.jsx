import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Grid, 
  Map as MapIcon, 
  BarChart2, 
  FileText, 
  Settings, 
  LogOut,
  HelpCircle,
  Menu
} from 'lucide-react';

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleSidebar = () => setExpanded(!expanded);

  return (
    <nav className={`app-sidebar ${expanded ? 'expanded' : ''}`}>
      <div className="nav-item" onClick={toggleSidebar} style={{cursor: 'pointer', marginBottom: '2rem'}}>
        <Menu size={20} />
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', alignItems: expanded ? 'flex-start' : 'center' }}>
        <NavLink to="/" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} title="Map Dashboard">
          <Grid size={20} />
          <span className="nav-label">Map Dashboard</span>
        </NavLink>
        
        <NavLink to="/analytics" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} title="Analytics">
          <BarChart2 size={20} />
          <span className="nav-label">Analytics</span>
        </NavLink>

        <NavLink to="/alerts" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} title="Alerts">
          <MapIcon size={20} />
          <span className="nav-label">Alerts</span>
        </NavLink>

        <NavLink to="/reports" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} title="Reports">
          <FileText size={20} />
          <span className="nav-label">Reports</span>
        </NavLink>

        <NavLink to="/settings" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`} title="Settings">
          <Settings size={20} />
          <span className="nav-label">Settings</span>
        </NavLink>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: expanded ? 'flex-start' : 'center' }}>
        <a href="#" className="nav-item" title="Help">
          <HelpCircle size={20} />
          <span className="nav-label">Help</span>
        </a>
        <a href="#" className="nav-item" title="Logout">
          <LogOut size={20} />
          <span className="nav-label">Logout</span>
        </a>
      </div>
    </nav>
  );
};

export default Sidebar;
