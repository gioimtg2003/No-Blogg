import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

// API methods
export const authApi = {
  login: (email: string, password: string, tenantSlug?: string) =>
    api.post('/api/auth/login', { email, password, tenantSlug }),
  
  register: (email: string, password: string, name: string, tenantSlug: string) =>
    api.post('/api/auth/register', { email, password, name, tenantSlug }),
};

export const tenantsApi = {
  getAll: () => api.get('/api/tenants'),
  getCurrent: () => api.get('/api/tenants/me'),
};

export const postsApi = {
  getAll: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get('/api/posts', { params }),
  
  getById: (id: string) => api.get(`/api/posts/${id}`),
  
  create: (data: any) => api.post('/api/posts', data),
  
  update: (id: string, data: any) => api.put(`/api/posts/${id}`, data),
  
  delete: (id: string) => api.delete(`/api/posts/${id}`),
};
