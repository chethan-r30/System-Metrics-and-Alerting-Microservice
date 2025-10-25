/**
 * API Service
 * Centralized API communication layer
 */
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  validateSession: () => api.post('/auth/validate-session'),
  logout: () => api.post('/auth/logout'),
};

// Metrics API
export const metricsAPI = {
  getMetrics: (type, limit = 50) => 
    api.get('/metrics', { params: { type, limit } }),
  getAverage: (type, count = 10) => 
    api.get('/metrics/average', { params: { type, count } }),
  collectMetrics: () => api.post('/metrics/collect'),
};

// Alerts API
export const alertsAPI = {
  getAlerts: (filters = {}) => api.get('/alerts', { params: filters }),
  getStatistics: () => api.get('/alerts/statistics'),
  getThresholds: () => api.get('/alerts/thresholds'),
  updateThresholds: (data) => api.put('/alerts/thresholds', data),
  resolveAlert: (id) => api.put(`/alerts/${id}/resolve`),
};

// Logs API
export const logsAPI = {
  analyze: (filePath) => api.post('/logs/analyze', { filePath }),
  getStatistics: () => api.get('/logs/statistics'),
};

// Summary API
export const summaryAPI = {
  getSummary: (lastN = 10) => api.get('/summary', { params: { lastN } }),
};

export default api;
