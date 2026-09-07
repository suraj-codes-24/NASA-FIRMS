import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchHotspots = async (limit = 1000) => {
  try {
    const response = await api.get(`/hotspots`, { params: { limit } });
    return response.data;
  } catch (error) {
    console.error('Error fetching hotspots:', error);
    return [];
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
export const fetchAnalyticsSummary = async () => {
  const response = await api.get(`/analytics/summary`);
  return response.data;
};

export const fetchAnalyticsClassification = async () => {
  const response = await api.get(`/analytics/classification`);
  return response.data;
};

export const fetchAnalyticsTimeline = async () => {
  const response = await api.get(`/analytics/timeline`);
  return response.data;
};

// --- Alerts ---
export const fetchAlerts = async () => {
  const response = await api.get(`/alerts`);
  return response.data;
};

export const acknowledgeAlert = async (id) => {
  const response = await api.put(`/alerts/${id}/acknowledge`);
  return response.data;
};

export const resolveAlert = async (id, resolution_note) => {
  const response = await api.put(`/alerts/${id}/resolve`, { resolution_note });
  return response.data;
};

// --- Reports & Auth ---
export const login = async (username, password) => {
  const response = await api.post(`/auth/login`, { username, password });
  return response.data;
};

export const generateReport = async () => {
  // Download CSV directly
  window.open('http://localhost:8000/api/v1/reports/generate', '_blank');
};

export default api;
