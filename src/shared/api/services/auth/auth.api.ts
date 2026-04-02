import api from '../../api.interface';
import type {
  TelegramStartRequest,
  TelegramStartResponse,
  VerifyOtpResponse,
} from './auth.types';

export const authApi = {
  /**
   * Telegram auth start.
   * Backend: POST http://localhost:5167/api/auth/telegram/start
   */
  startTelegramAuth: async (
    data: TelegramStartRequest
  ): Promise<TelegramStartResponse> => {
    const response = await api.post<TelegramStartResponse>(
      '/auth/telegram/start',
      data
    );
    return response.data;
  },

  verifyOtp: async (
    token: string,
    otp: string
  ): Promise<VerifyOtpResponse> => {
    const response = await api.post<VerifyOtpResponse>(
      '/auth/telegram/verify',
      {
        token,
        otp,
      }
    );
    return response.data;
  },
};
