import axios from 'axios';
import { localStorageHelper } from '../lib/localStorage';
import { useAuthStore } from '../store/authStore';

// API base URL - .env faylida VITE_API_URL o'rnatish kerak
const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - token qo'shish
api.interceptors.request.use(
  (config) => {
    const token = localStorageHelper.get<string>('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - 401 xatolikni boshqarish
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorageHelper.remove('access_token');
      localStorageHelper.remove('refresh_token');
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;
