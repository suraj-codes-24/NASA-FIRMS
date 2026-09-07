import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import MapDashboard from './pages/MapDashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import AlertsDashboard from './pages/AlertsDashboard';
import './App.css';

function App() {
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/alerts');
    ws.onopen = () => console.log('WebSocket Connected to Alerts Stream');
    ws.onmessage = (event) => {
      console.log('🚨 NEW ALERT RECEIVED:', event.data);
      // In a real app, dispatch to a toast notification library here
    };
    return () => ws.close();
  }, []);
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <main className="app-main">
          <Header />
          <div className="app-content">
            <Routes>
              <Route path="/" element={<MapDashboard />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
              <Route path="/alerts" element={<AlertsDashboard />} />
              {/* Fallbacks */}
              <Route path="/reports" element={<div style={{padding: '2rem'}}>Reports Page (Coming Soon)</div>} />
              <Route path="/settings" element={<div style={{padding: '2rem'}}>Settings Page (Coming Soon)</div>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
