import API from '../../api.interface';
import type {
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
