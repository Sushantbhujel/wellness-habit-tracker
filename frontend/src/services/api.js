import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
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

// Add response interceptor to handle errors
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

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.put('/auth/password', passwordData),
};

// Habits API calls
export const habitsAPI = {
  getAll: () => api.get('/habits'),
  getById: (id) => api.get(`/habits/${id}`),
  create: (habitData) => api.post('/habits', habitData),
  update: (id, habitData) => api.put(`/habits/${id}`, habitData),
  delete: (id) => api.delete(`/habits/${id}`),
  toggle: (id) => api.post(`/habits/${id}/toggle`),
  getProgress: (id) => api.get(`/habits/${id}/progress`),
};

// Goals API calls
export const goalsAPI = {
  getAll: () => api.get('/goals'),
  getById: (id) => api.get(`/goals/${id}`),
  create: (goalData) => api.post('/goals', goalData),
  update: (id, goalData) => api.put(`/goals/${id}`, goalData),
  delete: (id) => api.delete(`/goals/${id}`),
  updateProgress: (id, progressData) => api.put(`/goals/${id}/progress`, progressData),
  addMilestone: (id, milestoneData) => api.post(`/goals/${id}/milestones`, milestoneData),
  updateMilestone: (id, milestoneId, milestoneData) => api.put(`/goals/${id}/milestones/${milestoneId}`, milestoneData),
};

// Progress API calls
export const progressAPI = {
  getAll: (filters = {}) => api.get('/progress', { params: filters }),
  getById: (id) => api.get(`/progress/${id}`),
  create: (progressData) => api.post('/progress', progressData),
  update: (id, progressData) => api.put(`/progress/${id}`, progressData),
  delete: (id) => api.delete(`/progress/${id}`),
  getSummary: () => api.get('/progress/stats/summary'),
};

export default api;
