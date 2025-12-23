import axios from 'axios';

// Constants
export const TELEGRAM_BOT_USERNAME = 'agrofy_bot';

export type ViewState = 'initial' | 'otp' | 'loading' | 'error';

// Error messages
const ERROR_INVALID_OTP = "Noto'g'ri OTP kodi yoki session";
const ERROR_SESSION_NOT_FOUND = 'Session topilmadi. Qayta boshlang.';
const ERROR_DEFAULT = "Xatolik yuz berdi. Qayta urinib ko'ring.";

// Helper functions
export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    const data = err.response?.data;

    if (status === 400) {
      return ERROR_INVALID_OTP;
    }

    if (status === 404) {
      return ERROR_SESSION_NOT_FOUND;
    }

    if (status === 422) {
      // FastAPI validation error format
      if (Array.isArray(data?.detail)) {
        const firstError = data.detail[0];
        if (typeof firstError === 'object' && firstError?.msg) {
          return firstError.msg;
        }
        if (typeof firstError === 'string') {
          return firstError;
        }
      }
    }

    // Extract message from response
    if (data?.detail) {
      if (typeof data.detail === 'string') {
        return data.detail;
      }
      if (Array.isArray(data.detail) && data.detail.length > 0) {
        const first = data.detail[0];
        if (typeof first === 'object' && first?.msg) {
          return first.msg;
        }
        if (typeof first === 'string') {
          return first;
        }
      }
    }

    if (data?.message && typeof data.message === 'string') {
      return data.message;
    }
  }

  return ERROR_DEFAULT;
}

export function getTelegramBotLink(sessionId: string | null): string {
  const baseUrl = `https://t.me/${TELEGRAM_BOT_USERNAME}`;
  console.log(baseUrl);
  console.log('sessionId', sessionId);
  return sessionId ? `${baseUrl}?start=${sessionId}` : baseUrl;
}
