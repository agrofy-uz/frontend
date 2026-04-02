export interface TelegramStartRequest {
  clientId: string;
}

export interface TelegramStartResponse {
  token: string;
  deepLink: string;
  expiresAt: string;
}

export interface VerifyOtpRequest {
  token: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  phoneNumber: string;
  telegramUserId: number;
  telegramUsername: string;
  firstName: string;
  lastName: string;
  clientId: string;
  verifiedAt: string;
}
