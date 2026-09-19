import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Moon, Globe, Shield, Database } from 'lucide-react';

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};

const SettingCard = ({ icon, title, description, children }) => (
  <div className="glass-panel" style={{
    padding: '20px 24px',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px',
    borderRadius: '12px',
  }}>
    <div style={{
      backgroundColor: 'rgba(231, 76, 60, 0.15)',
      padding: '10px',
      borderRadius: '10px',
      color: '#e74c3c',
      flexShrink: 0,
    }}>
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600, color: 'white' }}>{title}</h3>
      <p style={{ margin: '4px 0 12px', fontSize: '13px', color: 'var(--text-secondary)' }}>{description}</p>
      {children}
    </div>
  </div>
);

const Toggle = ({ label, defaultChecked = false }) => (
  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', marginBottom: '8px' }}>
    <input type="checkbox" defaultChecked={defaultChecked} style={{
      appearance: 'none',
      width: '36px',
      height: '20px',
      backgroundColor: defaultChecked ? '#e74c3c' : 'rgba(255,255,255,0.1)',
      borderRadius: '10px',
      position: 'relative',
      cursor: 'pointer',
      transition: 'background 0.2s',
    }} />
    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{label}</span>
  </label>
);

const SettingsPage = () => {
  return (
    <motion.div {...pageTransition} style={{
      height: '100%',
      width: '100%',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      overflowY: 'auto',
    }}>
      <div style={{ marginBottom: '8px' }}>
        <h1 style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Settings size={22} /> Settings
        </h1>
        <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Configure your IGNIS dashboard preferences
        </p>
      </div>

      <SettingCard
        icon={<Bell size={20} />}
        title="Notification Preferences"
        description="Control how and when you receive alerts about fire events."
      >
        <Toggle label="Push notifications for Industrial Fires" defaultChecked={true} />
        <Toggle label="Push notifications for Gas Flares" defaultChecked={false} />
        <Toggle label="Email digest (daily summary)" defaultChecked={false} />
        <Toggle label="Sound alerts for CRITICAL severity" defaultChecked={true} />
      </SettingCard>

      <SettingCard
        icon={<Globe size={20} />}
        title="Map Preferences"
        description="Customize the default map view and layer settings."
      >
        <Toggle label="Show industrial facility buffers by default" defaultChecked={true} />
        <Toggle label="Show heatmap layer by default" defaultChecked={false} />
        <Toggle label="Cluster markers at low zoom levels" defaultChecked={true} />
        <div style={{ marginTop: '8px' }}>
          <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
            Default zoom level
          </label>
          <input type="range" min="4" max="15" defaultValue="5" style={{ width: '200px' }} />
        </div>
      </SettingCard>

      <SettingCard
        icon={<Database size={20} />}
        title="Data Ingestion"
        description="Configure automatic FIRMS data fetching schedule."
      >
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Ingestion interval:</label>
          <select defaultValue="3" style={{
            padding: '6px 12px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)',
            backgroundColor: 'rgba(255,255,255,0.05)',
            color: 'white',
            fontSize: '13px',
          }}>
            <option value="1">Every 1 hour</option>
            <option value="3">Every 3 hours (default)</option>
            <option value="6">Every 6 hours</option>
            <option value="12">Every 12 hours</option>
          </select>
        </div>
      </SettingCard>

      <SettingCard
        icon={<Moon size={20} />}
        title="Appearance"
        description="Theme and display customization."
      >
        <Toggle label="Dark mode (default)" defaultChecked={true} />
        <Toggle label="High contrast mode" defaultChecked={false} />
      </SettingCard>

      <SettingCard
        icon={<Shield size={20} />}
        title="Account & Security"
        description="Manage your account settings."
      >
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.15)',
            backgroundColor: 'rgba(255,255,255,0.05)',
            color: 'white',
            fontSize: '13px',
            cursor: 'pointer',
          }}>
            Change Password
          </button>
          <button style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(231,76,60,0.3)',
            backgroundColor: 'rgba(231,76,60,0.1)',
            color: '#e74c3c',
            fontSize: '13px',
            cursor: 'pointer',
          }}>
            Sign Out
          </button>
        </div>
      </SettingCard>
    </motion.div>
  );
};

export default SettingsPage;
