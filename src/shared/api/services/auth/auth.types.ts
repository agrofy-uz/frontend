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

export interface AuthTokensResponse {
  accessToken: string;
  accessExpiresAt: string;
  refreshToken: string;
  refreshExpiresAt: string;
  forcedLogoutAt: string;
}

export type VerifyOtpResponse = AuthTokensResponse;

export interface AuthMeResponse {
  id: number;
  phoneNumber: string;
  telegramUserId: number;
  telegramUsername: string | null;
  firstName: string | null;
  lastName: string | null;
  lastClientId: string | null;
  createdAt: string;
  updatedAt: string;
  lastVerifiedAt: string | null;
  imageUrl: string | null;
  premium: boolean;
  premiumExpiresAt: string | null;
  /** Masalan `"free"`, `"pro"` yoki ba'zan raqamli enum */
  premiumPlanTier?: string | number | null;
  /** UI uchun o‘zbekcha yorliq, masalan «Bepul» */
  premiumPlanTierLabelUz?: string | null;
  premiumPlanMonths?: number | null;
  premiumPlanMonthsUnlimited?: boolean;

  /** JWT access token */
  // NOTE: me javobida tokenlar bo'lmaydi, ular verify javobidan olinadi
}
