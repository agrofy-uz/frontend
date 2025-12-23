import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface StartSessionResponse {
  login_session_id: string;
}

export interface VerifyOtpRequest {
  login_session_id: string;
  otp: string;
}

export interface UserResponse {
  id: string;
  email?: string;
  name?: string;
  role: string;
}

export interface VerifyOtpResponse {
  user: UserResponse;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export const authApi = {
  // Session boshlash
  startSession: async (): Promise<StartSessionResponse> => {
    const response = await api.post<StartSessionResponse>(
      '/api/v1/auth/start-session'
    );
    return response.data;
  },

  // OTP tasdiqlash
  verifyOtp: async (
    loginSessionId: string,
    otp: string
  ): Promise<VerifyOtpResponse> => {
    const response = await api.post<VerifyOtpResponse>(
      '/api/v1/auth/verify-otp',
      {
        login_session_id: loginSessionId,
        otp,
      }
    );
    return response.data;
  },
};
