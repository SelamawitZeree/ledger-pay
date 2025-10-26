import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8090';

export const authApi = axios.create({
  baseURL: `${baseURL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const accountsApi = axios.create({
  baseURL: `${baseURL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const postingApi = axios.create({
  baseURL: `${baseURL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const queryApi = axios.create({
  baseURL: `${baseURL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const auditApi = axios.create({
  baseURL: `${baseURL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
[authApi, accountsApi, postingApi, queryApi, auditApi].forEach(api => {
  api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('lp_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  });
});
