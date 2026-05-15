import axios, { type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/authStore';
import {
  ensureFreshAccessToken,
  isAuthErrorRequiringLogout,
  refreshAccessToken,
} from '../lib/authSession';
import { API_BASE_URL } from './refreshClient';

export { API_BASE_URL };

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

function shouldSkip401Refresh(config: InternalAxiosRequestConfig): boolean {
  const url = String(config.url ?? '');
  if (url.includes('/auth/refresh')) return true;
  if (url.includes('/auth/telegram/start')) return true;
  if (url.includes('/auth/telegram/verify')) return true;
  return false;
}

api.interceptors.request.use(
  async (config) => {
    await ensureFreshAccessToken();
    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, unknown>).Authorization =
        `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (
      status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      shouldSkip401Refresh(originalRequest)
    ) {
      if (
        status === 401 &&
        originalRequest &&
        shouldSkip401Refresh(originalRequest)
      ) {
        useAuthStore.getState().logout();
      }
      return Promise.reject(error);
    }

    try {
      await refreshAccessToken();
      originalRequest._retry = true;
      const { accessToken } = useAuthStore.getState();
      originalRequest.headers = originalRequest.headers ?? {};
      (originalRequest.headers as Record<string, unknown>).Authorization =
        accessToken ? `Bearer ${accessToken}` : undefined;
      return api(originalRequest);
    } catch (refreshErr) {
      if (isAuthErrorRequiringLogout(refreshErr)) {
        useAuthStore.getState().logout();
      }
      return Promise.reject(error);
    }
  },
);

export default api;

export const API = api;

export { refreshApi } from './refreshClient';
