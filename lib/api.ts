import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

// Authentication
export const authAPI = {
  signup: (data: { name: string; email: string; password: string; role?: string }) =>
    api.post('/api/auth/signup', data),
  
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
};

// Issues
export const issuesAPI = {
  getAll: (sort = 'newest', type?: string, status?: string) =>
    api.get('/api/issues', { params: { sort, type, status } }),
  
  getSingle: (id: number) =>
    api.get(`/api/issues/${id}`),
  
  create: (data: { title: string; description: string; type: string }) =>
    api.post('/api/issues', data),
  
  update: (id: number, data: Partial<{ title: string; description: string; type: string; status: string }>) =>
    api.patch(`/api/issues/${id}`, data),
  
  delete: (id: number) =>
    api.delete(`/api/issues/${id}`),
};

export default api;