import api from '../../api.interface';
import type {
  StartSessionResponse,
  VerifyOtpResponse,
} from './auth.types';

export const authApi = {
  startSession: async (): Promise<StartSessionResponse> => {
    const response = await api.post<StartSessionResponse>(
      '/v1/auth/start-session'
    );
    return response.data;
  },

  verifyOtp: async (
    loginSessionId: string,
    otp: string
  ): Promise<VerifyOtpResponse> => {
    const response = await api.post<VerifyOtpResponse>('/v1/auth/verify-otp', {
      login_session_id: loginSessionId,
      otp,
    });
    return response.data;
  },
};
