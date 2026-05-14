import API, { refreshApi } from '../../api.interface';
import type {
  AuthMeResponse,
  AuthTokensResponse,
  TelegramStartRequest,
  TelegramStartResponse,
  VerifyOtpResponse,
} from './auth.types';

/**
 * Telegram auth start.
 * POST /api/auth/telegram/start
 */
export const startTelegramAuth = async (
  data: TelegramStartRequest,
): Promise<TelegramStartResponse> => {
  const response = await API.post<TelegramStartResponse>(
    '/auth/telegram/start',
    data,
  );
  return response.data;
};

export const verifyOtp = async (
  token: string,
  otp: string,
): Promise<VerifyOtpResponse> => {
  const response = await API.post<VerifyOtpResponse>(
    '/auth/telegram/verify',
    {
      token,
      otp,
    },
  );
  return response.data;
};

/** Store + interceptor orqali (access yangilash, 401 qayta urinish) */
export const getAuthMe = async (): Promise<AuthMeResponse> => {
  const response = await API.get<AuthMeResponse>('/auth/me');
  return response.data;
};

/** Verify javobidagi token bilan — `login()` dan oldin store hali bo‘sh */
export const getAuthMeWithBearer = async (
  accessToken: string,
): Promise<AuthMeResponse> => {
  const response = await refreshApi.get<AuthMeResponse>('/auth/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

export const refreshAuthToken = async (
  refreshToken: string,
): Promise<AuthTokensResponse> => {
  const response = await API.post<AuthTokensResponse>('/auth/refresh', {
    refreshToken,
  });
  return response.data;
};

export const logoutAuth = async (refreshToken: string): Promise<void> => {
  await API.post('/auth/logout', { refreshToken });
};
