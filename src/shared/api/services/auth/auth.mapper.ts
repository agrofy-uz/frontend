import { normalizePremiumPlanTierFromApi } from '@/shared/lib/premiumTier';
import type { IUser } from '@/shared/store/authStore';
import type { AuthMeResponse } from './auth.types';
import { readMeBool, readMeField } from './authMePayload';

/** `GET /auth/me` javobini `IUser` (store / UI) ko‘rinishiga o‘tkazadi */
export function mapAuthMeToUser(me: AuthMeResponse): IUser {
  const raw = me as object;
  const imageUrl = readMeField(raw, 'imageUrl', 'ImageUrl');

  const phone =
    (readMeField(raw, 'phoneNumber', 'PhoneNumber') as string | undefined) ?? '';

  const telegramUserId = Number(
    readMeField(raw, 'telegramUserId', 'TelegramUserId') ?? 0,
  );

  const tierRaw = readMeField(
    raw,
    'premiumPlanTier',
    'PremiumPlanTier',
  ) as string | number | null | undefined;

  const labelUz = readMeField(
    raw,
    'premiumPlanTierLabelUz',
    'PremiumPlanTierLabelUz',
  ) as string | null | undefined;

  const monthsRaw = readMeField(
    raw,
    'premiumPlanMonths',
    'PremiumPlanMonths',
  );

  const expiresRaw = readMeField(
    raw,
    'premiumExpiresAt',
    'PremiumExpiresAt',
  ) as string | null | undefined;

  const img =
    typeof imageUrl === 'string' && imageUrl.trim() ? imageUrl.trim() : null;

  const premiumMonths =
    typeof monthsRaw === 'number' && Number.isFinite(monthsRaw) ? monthsRaw : null;

  const idRaw = readMeField(raw, 'id', 'Id');

  return {
    id: String(idRaw ?? me.id),
    phone_number: phone,
    telegram_id: telegramUserId,
    first_name: (readMeField(raw, 'firstName', 'FirstName') as string | null) ?? null,
    last_name: (readMeField(raw, 'lastName', 'LastName') as string | null) ?? null,
    username:
      (readMeField(raw, 'telegramUsername', 'TelegramUsername') as string | null) ??
      null,
    created_at:
      (readMeField(raw, 'createdAt', 'CreatedAt') as string | null) ?? null,
    is_active: true,
    photo_url: img,
    premium: readMeBool(raw, 'premium', 'Premium'),
    premium_expires_at: (expiresRaw as string | null) ?? null,
    premium_plan_tier: normalizePremiumPlanTierFromApi(tierRaw),
    premium_plan_tier_label_uz: labelUz ?? null,
    premium_plan_months: premiumMonths,
  };
}
