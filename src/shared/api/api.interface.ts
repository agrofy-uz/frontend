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

const refreshApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let refreshPromise: Promise<void> | null = null;

function isExpired(isoDate: string | null | undefined): boolean {
  if (!isoDate) return false;
  const expiresAt = Date.parse(isoDate);
  if (Number.isNaN(expiresAt)) return false;
  return Date.now() >= expiresAt;
}

async function ensureFreshAccessToken(): Promise<void> {
  const state = useAuthStore.getState();
  const { refreshToken, accessExpiresAt, refreshExpiresAt, forcedLogoutAt } = state;

  if (!isExpired(accessExpiresAt)) return;
  if (!refreshToken || isExpired(refreshExpiresAt) || isExpired(forcedLogoutAt)) {
    state.logout();
    throw new Error('Session expired');
  }

  if (!refreshPromise) {
    refreshPromise = refreshApi
      .post<{
        accessToken: string;
        accessExpiresAt: string;
        refreshToken: string;
        refreshExpiresAt: string;
        forcedLogoutAt: string;
      }>('/auth/refresh', { refreshToken })
      .then((res) => {
        const next = res.data;
        useAuthStore.setState({
          isAuthenticated: true,
          accessToken: next.accessToken,
          refreshToken: next.refreshToken,
          accessExpiresAt: next.accessExpiresAt,
          refreshExpiresAt: next.refreshExpiresAt,
          forcedLogoutAt: next.forcedLogoutAt,
        });
      })
      .catch((error) => {
        useAuthStore.getState().logout();
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  await refreshPromise;
}

// Request interceptor - token qo'shish
api.interceptors.request.use(
  async (config) => {
    await ensureFreshAccessToken();
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      // axios v1: config.headers ba'zida undefined yoki AxiosHeaders bo'lishi mumkin
      config.headers = config.headers ?? {};
      (config.headers as Record<string, unknown>).Authorization =
        `Bearer ${accessToken}`;
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
