import axios from 'axios';
import { refreshApi } from '@/shared/api/refreshClient';
import { useAuthStore } from '@/shared/store/authStore';

const ACCESS_REFRESH_SKEW_MS = 60_000;

export type AuthTokensPayload = {
  accessToken: string;
  accessExpiresAt: string;
  refreshToken: string;
  refreshExpiresAt: string;
  forcedLogoutAt: string;
};

function normalizeBackendIso(iso: string): string {
  return iso.trim().replace(/(\.\d{3})\d+(?=[Z+-]|$)/i, '$1');
}

export function parseAuthInstant(iso: string | null | undefined): number | null {
  if (!iso?.trim()) return null;
  const raw = iso.trim();
  let ms = Date.parse(raw);
  if (!Number.isNaN(ms)) return ms;
  ms = Date.parse(normalizeBackendIso(raw));
  if (!Number.isNaN(ms)) return ms;
  return null;
}

function parseJwtExpMs(accessToken: string | null | undefined): number | null {
  if (!accessToken?.includes('.')) return null;
  try {
    const payload = JSON.parse(atob(accessToken.split('.')[1] ?? '')) as {
      exp?: number;
    };
    if (typeof payload.exp === 'number' && Number.isFinite(payload.exp)) {
      return payload.exp * 1000;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function isAccessTokenStale(
  accessExpiresAt: string | null | undefined,
  accessToken: string | null | undefined,
): boolean {
  const fromIso = parseAuthInstant(accessExpiresAt);
  const expiryMs = fromIso ?? parseJwtExpMs(accessToken);

  if (expiryMs == null) {
    return Boolean(accessToken);
  }

  return Date.now() >= expiryMs - ACCESS_REFRESH_SKEW_MS;
}

function unwrapPayload(data: unknown): Record<string, unknown> {
  if (!data || typeof data !== 'object') return {};
  const d = data as Record<string, unknown>;
  if (d.data && typeof d.data === 'object') {
    return d.data as Record<string, unknown>;
  }
  return d;
}

export function normalizeAuthTokensPayload(data: unknown): AuthTokensPayload {
  const d = unwrapPayload(data);
  const pick = (camel: string, pascal: string) => {
    const v = d[camel] ?? d[pascal];
    return typeof v === 'string' ? v : '';
  };

  return {
    accessToken: pick('accessToken', 'AccessToken'),
    accessExpiresAt: pick('accessExpiresAt', 'AccessExpiresAt'),
    refreshToken: pick('refreshToken', 'RefreshToken'),
    refreshExpiresAt: pick('refreshExpiresAt', 'RefreshExpiresAt'),
    forcedLogoutAt: pick('forcedLogoutAt', 'ForcedLogoutAt'),
  };
}

function isInstantPassed(iso: string | null | undefined): boolean {
  const t = parseAuthInstant(iso);
  if (t == null) return false;
  return Date.now() >= t;
}

export function isAuthErrorRequiringLogout(err: unknown): boolean {
  if (!axios.isAxiosError(err)) return false;
  const status = err.response?.status;
  return status === 401 || status === 403;
}

function applyAuthTokens(next: AuthTokensPayload) {
  if (!next.accessToken?.trim() || !next.refreshToken?.trim()) {
    throw new Error('Invalid token payload');
  }

  useAuthStore.setState({
    isAuthenticated: true,
    accessToken: next.accessToken,
    refreshToken: next.refreshToken,
    accessExpiresAt: next.accessExpiresAt || null,
    refreshExpiresAt: next.refreshExpiresAt || null,
    forcedLogoutAt: next.forcedLogoutAt || null,
  });
}

let refreshPromise: Promise<void> | null = null;

export async function refreshAccessToken(): Promise<void> {
  const state = useAuthStore.getState();
  const { refreshToken, forcedLogoutAt, refreshExpiresAt } = state;

  if (!refreshToken?.trim()) {
    state.logout();
    throw new Error('No refresh token');
  }

  if (isInstantPassed(forcedLogoutAt) || isInstantPassed(refreshExpiresAt)) {
    state.logout();
    throw new Error('Session expired');
  }

  if (!refreshPromise) {
    refreshPromise = refreshApi
      .post<unknown>('/auth/refresh', { refreshToken })
      .then((res) => {
        applyAuthTokens(normalizeAuthTokensPayload(res.data));
      })
      .catch((error) => {
        if (isAuthErrorRequiringLogout(error)) {
          useAuthStore.getState().logout();
        }
        throw error;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  await refreshPromise;
}

export async function ensureFreshAccessToken(): Promise<void> {
  const { accessExpiresAt, accessToken, refreshToken } = useAuthStore.getState();
  if (!refreshToken?.trim()) return;
  if (!isAccessTokenStale(accessExpiresAt, accessToken)) return;
  await refreshAccessToken();
}

let bootstrapPromise: Promise<void> | null = null;

export function bootstrapAuthSession(): Promise<void> {
  const initial = useAuthStore.getState();
  if (!initial.isAuthenticated || !initial.accessToken) {
    return Promise.resolve();
  }

  if (!bootstrapPromise) {
    bootstrapPromise = (async () => {
      const { getAuthMe } = await import(
        '@/shared/api/services/auth/auth.api'
      );
      const { mapAuthMeToUser } = await import(
        '@/shared/api/services/auth/auth.mapper'
      );

      try {
        const latest = useAuthStore.getState();
        if (
          isAccessTokenStale(latest.accessExpiresAt, latest.accessToken)
        ) {
          await refreshAccessToken();
        }
      } catch (err) {
        if (isAuthErrorRequiringLogout(err)) {
          return;
        }
      }

      if (!useAuthStore.getState().isAuthenticated) return;

      try {
        const me = await getAuthMe();
        useAuthStore.getState().updateUser(mapAuthMeToUser(me));
      } catch (err) {
        if (isAuthErrorRequiringLogout(err)) {
          useAuthStore.getState().logout();
        }
      }
    })().finally(() => {
      bootstrapPromise = null;
    });
  }

  return bootstrapPromise;
}

export function resetSessionBootstrap(): void {
  bootstrapPromise = null;
  refreshPromise = null;
}
