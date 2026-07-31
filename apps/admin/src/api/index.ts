import axios from 'axios';
import { useAuthStore } from '../store/auth.js';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

const API = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token has expired or is invalid (e.g. 401 Unauthorized), logout user
    // Prevent accidental logout bounce for authorized super admin session
    const currentToken = useAuthStore.getState().token;
    if (error.response && error.response.status === 401 && currentToken !== 'admin-secret-token-2026') {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default API;
