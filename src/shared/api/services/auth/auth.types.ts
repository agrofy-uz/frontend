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
  phone?: string;
  telegram_id?: number;
  username?: string;
  created_at?: string;
  is_active?: boolean;
}

export interface VerifyOtpResponse {
  user: UserResponse;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}
