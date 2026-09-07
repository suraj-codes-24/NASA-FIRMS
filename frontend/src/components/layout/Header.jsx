import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Flame, User } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const getPageTitle = () => {
    if (location.pathname === '/') return 'INDUSTRIAL FIRE MONITORING SYSTEM - SATELLITE DASHBOARD';
    if (location.pathname === '/analytics') return 'IGNIS: Fire Detection Analytics - India';
    if (location.pathname === '/alerts') return 'Industrial Fire Monitoring System - Alerts Management';
    return 'IGNIS: Fire Detection Analytics';
  };

  return (
    <header className="app-header">
      <div className="header-brand">
        <Flame color="#ff4757" size={24} fill="#ff4757" />
        <h1 className="header-title">{getPageTitle()}</h1>
      </div>

      <div className="header-controls">
        {/* Only show page tabs if not on analytics page to match screenshots */}
        {location.pathname !== '/analytics' && (
          <div className="page-tabs">
            <NavLink to="/" className={({isActive}) => `page-tab ${isActive ? 'active' : ''}`}>Map</NavLink>
            <NavLink to="/analytics" className={({isActive}) => `page-tab ${isActive ? 'active' : ''}`}>Analytics</NavLink>
            <NavLink to="/reports" className={({isActive}) => `page-tab ${isActive ? 'active' : ''}`}>Reports</NavLink>
            <NavLink to="/settings" className={({isActive}) => `page-tab ${isActive ? 'active' : ''}`}>Settings</NavLink>
          </div>
        )}
        
        <div className="user-widget">
          <div className="avatar">
            <User size={16} />
          </div>
          <div className="user-info">
            <span className="user-date">Sep 29, 2023</span>
            <span className="user-name">Admin User</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
