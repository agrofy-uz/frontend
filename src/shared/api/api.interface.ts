import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// API base URL - .env faylida VITE_API_URL o'rnatish kerak
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  // 'https://skinflinty-danica-hyperscholastically.ngrok-free.dev/api';
  'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - token qo'shish
api.interceptors.request.use(
  (config) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
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
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default api;

/** Axios instance — `API.get<T>(...)` / `API.post<T>(...)` */
export const API = api;
