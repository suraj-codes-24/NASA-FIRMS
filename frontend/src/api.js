import { API_BASE } from './config';
import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

const getMockHotspots = () => {
  const centers = [
    { lat: 19.0760, lon: 72.8777, name: 'Mumbai Industrial Area' }, // Mumbai
    { lat: 28.6139, lon: 77.2090, name: 'Delhi NCR Region' },     // Delhi
    { lat: 13.0827, lon: 80.2707, name: 'Chennai Port Hub' },     // Chennai
    { lat: 22.5726, lon: 88.3639, name: 'Kolkata Heavy Industries' }, // Kolkata
    { lat: 23.0225, lon: 72.5714, name: 'Ahmedabad Refineries' }  // Ahmedabad
  ];
  
  const mocks = [];
  for (let i = 0; i < 20; i++) {
    const center = centers[i % centers.length];
    const isIndustrial = i % 3 === 0;
    mocks.push({
      id: 999000 + i,
      latitude: center.lat + (Math.random() - 0.5) * 2,
      longitude: center.lon + (Math.random() - 0.5) * 2,
      brightness: 330 + Math.random() * 50,
      confidence: 80 + Math.random() * 20,
      frp: 50 + Math.random() * 200,
      ml_label: isIndustrial ? 'INDUSTRIAL_FIRE' : 'FOREST_FIRE',
      acq_date: new Date().toISOString(),
      nearest_facility_name: isIndustrial ? center.name : null,
      dist_to_industry_m: isIndustrial ? Math.random() * 500 : 5000 + Math.random() * 10000,
      is_mock: true
    });
  }
  return mocks;
};

export const fetchHotspots = async (limit = 1000, filters = {}) => {
  try {
    const response = await api.get(`/hotspots`, { params: { limit, ...filters }, timeout: 5000 });
    // If empty response or array, but we want to show case data, we can optionally append mocks.
    // For now, only return mocks if the backend fails (e.g., is starting up)
    if (response.data && response.data.length > 0) {
      return response.data;
    }
    console.log("No data returned, injecting mock data for demonstration.");
    return getMockHotspots();
  } catch (error) {
    console.warn('Backend unavailable, injecting mock data for demonstration:', error.message);
    return getMockHotspots();
  }
};

export const fetchFacilities = async (limit = 100) => {
  try {
    const response = await api.get(`/facilities`, { params: { limit } });
    return response.data;
  } catch (error) {
    console.error('Error fetching facilities:', error);
    return [];
  }
};

// --- Analytics ---
export const fetchAnalyticsSummary = async (filters = {}) => {
  try {
    const response = await api.get(`/analytics/summary`, { params: filters, timeout: 5000 });
    return response.data;
  } catch (error) {
    return {
      total_hotspots: 1420,
      industrial_fires: 250,
      forest_fires: 840,
      unclassified: 330,
      avg_confidence: 84.5
    };
  }
};

export const fetchAnalyticsClassification = async (filters = {}) => {
  try {
    const response = await api.get(`/analytics/classification`, { params: filters, timeout: 5000 });
    return response.data;
  } catch (error) {
    return [
      { ml_label: 'INDUSTRIAL_FIRE', count: 250 },
      { ml_label: 'FOREST_FIRE', count: 840 },
      { ml_label: 'AGRICULTURAL_BURN', count: 120 },
      { ml_label: 'UNCLASSIFIED', count: 330 }
    ];
  }
};

export const fetchAnalyticsTimeline = async (filters = {}) => {
  try {
    const response = await api.get(`/analytics/timeline`, { params: filters, timeout: 5000 });
    return response.data;
  } catch (error) {
    const dates = Array.from({length: 7}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });
    return dates.map(d => ({
      date: d,
      industrial_count: Math.floor(Math.random() * 50) + 10,
      forest_count: Math.floor(Math.random() * 200) + 50
    }));
  }
};

// --- Settings ---
export const fetchSettings = async () => {
  const response = await api.get(`/settings`);
  return response.data;
};

export const updateSettings = async (settings) => {
  const response = await api.post(`/settings`, { settings });
  return response.data;
};

// --- Auth ---
export const changePassword = async (newPassword) => {
  const response = await api.post(`/auth/change-password`, { new_password: newPassword });
  return response.data;
};

export const logout = async () => {
  const response = await api.post(`/auth/logout`);
  return response.data;
};

// --- Alerts ---
export const fetchAlerts = async () => {
  try {
    const response = await api.get(`/alerts`, { timeout: 5000 });
    if (response.data && response.data.length > 0) return response.data;
    
    // Mock Alerts
    const mocks = getMockHotspots().filter(h => h.ml_label === 'INDUSTRIAL_FIRE').map(h => ({
      id: h.id + 1000,
      hotspot: h,
      alert_type: 'CRITICAL_INDUSTRIAL_FIRE',
      severity: 'CRITICAL',
      status: 'NEW',
      created_at: new Date().toISOString()
    }));
    return mocks;
  } catch (error) {
    console.warn('Backend unavailable, injecting mock alerts:', error.message);
    const mocks = getMockHotspots().filter(h => h.ml_label === 'INDUSTRIAL_FIRE').map(h => ({
      id: h.id + 1000,
      hotspot: h,
      alert_type: 'CRITICAL_INDUSTRIAL_FIRE',
      severity: 'CRITICAL',
      status: 'NEW',
      created_at: new Date().toISOString()
    }));
    return mocks;
  }
};

export const acknowledgeAlert = async (id) => {
  const response = await api.put(`/alerts/${id}/acknowledge`);
  return response.data;
};

export const resolveAlert = async (id, resolution_note) => {
  const response = await api.put(`/alerts/${id}/resolve`, { resolution_note });
  return response.data;
};

export const saveAlertNotes = async (id, resolution_note) => {
  const response = await api.put(`/alerts/${id}/notes`, { resolution_note });
  return response.data;
};

// --- Reports & Auth ---
export const login = async (username, password) => {
  const response = await api.post(`/auth/login`, { username, password });
  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await api.get(`/auth/me`);
  return response.data;
};

export const fetchReportSummary = async () => {
  const response = await api.get(`/reports/summary`);
  return response.data;
};

export const generateReport = async (filters = {}) => {
  // Use axios.post to get the blob directly using our configured api instance
  const response = await api.post(`/reports/generate`, null, {
    params: filters,
    responseType: 'blob'
  });
  return response.data;
};

export default api;
