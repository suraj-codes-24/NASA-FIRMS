import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import MapDashboard from './pages/MapDashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import AlertsDashboard from './pages/AlertsDashboard';
import HotspotDetailPage from './pages/HotspotDetailPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage';
import useWebSocket from './hooks/useWebSocket';
import './App.css';

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const pageTransition = { duration: 0.25, ease: 'easeInOut' };

function PageWrapper({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      style={{ height: '100%', width: '100%' }}
    >
      {children}
    </motion.div>
  );
}

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

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Login page — no sidebar/header layout */}
        <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />

        {/* All dashboard routes wrapped in AppLayout */}
        <Route path="/" element={<AppLayout><PageWrapper><MapDashboard /></PageWrapper></AppLayout>} />
        <Route path="/analytics" element={<AppLayout><PageWrapper><AnalyticsDashboard /></PageWrapper></AppLayout>} />
        <Route path="/alerts" element={<AppLayout><PageWrapper><AlertsDashboard /></PageWrapper></AppLayout>} />
        <Route path="/hotspot/:id" element={<AppLayout><PageWrapper><HotspotDetailPage /></PageWrapper></AppLayout>} />
        <Route path="/reports" element={<AppLayout><PageWrapper><ReportsPage /></PageWrapper></AppLayout>} />
        <Route path="/settings" element={<AppLayout><PageWrapper><SettingsPage /></PageWrapper></AppLayout>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}

export default App;
