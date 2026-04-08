import axios, { type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/authStore';

/** Access JWT tugashidan ~shu vaqt oldin yangilash (tarmoq kechikishi uchun) */
const ACCESS_REFRESH_SKEW_MS = 60_000;

type AuthTokensPayload = {
  accessToken: string;
  accessExpiresAt: string;
  refreshToken: string;
  refreshExpiresAt: string;
  forcedLogoutAt: string;
};

/** .NET kabi 7 xonali kasr sonli ISO — JS Date.parse ba'zan NaN qaytaradi */
function normalizeBackendIso(iso: string): string {
  return iso.trim().replace(/(\.\d{3})\d+(?=[Z+-]|$)/i, '$1');
}

function parseAuthInstant(iso: string | null | undefined): number | null {
  if (!iso?.trim()) return null;
  const raw = iso.trim();
  let ms = Date.parse(raw);
  if (!Number.isNaN(ms)) return ms;
  ms = Date.parse(normalizeBackendIso(raw));
  if (!Number.isNaN(ms)) return ms;
  return null;
}

/** true: muddat tugagan yoki skew ichida (tez orada tugaydi) */
function isAccessStale(iso: string | null | undefined): boolean {
  const t = parseAuthInstant(iso);
  if (t == null) return false;
  return Date.now() >= t - ACCESS_REFRESH_SKEW_MS;
}

/** refresh / forcedLogout uchun — aniq tugagan deb hisoblanadi */
function isInstantPassed(iso: string | null | undefined): boolean {
  const t = parseAuthInstant(iso);
  if (t == null) return false;
  return Date.now() >= t;
}

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

function applyAuthTokens(next: AuthTokensPayload) {
  useAuthStore.setState({
    isAuthenticated: true,
    accessToken: next.accessToken,
    refreshToken: next.refreshToken,
    accessExpiresAt: next.accessExpiresAt,
    refreshExpiresAt: next.refreshExpiresAt,
    forcedLogoutAt: next.forcedLogoutAt,
  });
}

/** Bir marta refresh (parallel so'rovlar bitta promise kutadi) */
async function performTokenRefresh(): Promise<void> {
  const state = useAuthStore.getState();
  const { refreshToken, refreshExpiresAt, forcedLogoutAt } = state;

  if (
    !refreshToken ||
    isInstantPassed(refreshExpiresAt) ||
    isInstantPassed(forcedLogoutAt)
  ) {
    state.logout();
    throw new Error('Session expired');
  }

  if (!refreshPromise) {
    refreshPromise = refreshApi
      .post<AuthTokensPayload>('/auth/refresh', { refreshToken })
      .then((res) => {
        applyAuthTokens(res.data);
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

async function ensureFreshAccessToken(): Promise<void> {
  const { accessExpiresAt } = useAuthStore.getState();

  if (!isAccessStale(accessExpiresAt)) return;

  await performTokenRefresh();
}

function shouldSkip401Refresh(config: InternalAxiosRequestConfig): boolean {
  const url = String(config.url ?? '');
  if (url.includes('/auth/refresh')) return true;
  if (url.includes('/auth/telegram/start')) return true;
  if (url.includes('/auth/telegram/verify')) return true;
  return false;
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

// Response: 401 — avval refresh, keyin so'rovni 1 marta qayta urinish
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
      if (status === 401) {
        useAuthStore.getState().logout();
      }
      return Promise.reject(error);
    }

    try {
      await performTokenRefresh();
      originalRequest._retry = true;
      const { accessToken } = useAuthStore.getState();
      originalRequest.headers = originalRequest.headers ?? {};
      (originalRequest.headers as Record<string, unknown>).Authorization =
        accessToken ? `Bearer ${accessToken}` : undefined;
      return api(originalRequest);
    } catch {
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }
  }
);

export default api;

/** Axios instance — `API.get<T>(...)` / `API.post<T>(...)` */
export const API = api;
