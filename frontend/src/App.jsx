import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import MapDashboard from './pages/MapDashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import AlertsDashboard from './pages/AlertsDashboard';
import HotspotDetailPage from './pages/HotspotDetailPage';
import ReportsPage from './pages/ReportsPage';
import LoginPage from './pages/LoginPage';
import useWebSocket from './hooks/useWebSocket';
import './App.css';

function AppLayout({ children }) {
  // Connect WebSocket for real-time alerts
  useWebSocket('ws://localhost:8000/ws/alerts');

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <Header />
        <div className="app-content">
          {children}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login page — no sidebar/header layout */}
        <Route path="/login" element={<LoginPage />} />

        {/* All dashboard routes wrapped in AppLayout */}
        <Route path="/" element={<AppLayout><MapDashboard /></AppLayout>} />
        <Route path="/analytics" element={<AppLayout><AnalyticsDashboard /></AppLayout>} />
        <Route path="/alerts" element={<AppLayout><AlertsDashboard /></AppLayout>} />
        <Route path="/hotspot/:id" element={<AppLayout><HotspotDetailPage /></AppLayout>} />
        <Route path="/reports" element={<AppLayout><ReportsPage /></AppLayout>} />
        <Route path="/settings" element={<AppLayout><div style={{padding: '2rem'}}>Settings Page (Coming Soon)</div></AppLayout>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
