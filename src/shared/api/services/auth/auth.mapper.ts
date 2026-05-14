import type { IUser } from '@/shared/store/authStore';
import type { AuthMeResponse } from './auth.types';

/** `GET /auth/me` javobini `IUser` (store / UI) ko‘rinishiga o‘tkazadi */
export function mapAuthMeToUser(me: AuthMeResponse): IUser {
  return {
    id: String(me.id),
    phone_number: me.phoneNumber || '',
    telegram_id: me.telegramUserId || 0,
    first_name: me.firstName || null,
    last_name: me.lastName || null,
    username: me.telegramUsername || null,
    created_at: me.createdAt || null,
    is_active: true,
    photo_url:
      typeof me.imageUrl === 'string' && me.imageUrl.trim()
        ? me.imageUrl.trim()
        : null,
    premium: Boolean(me.premium),
    premium_expires_at: me.premiumExpiresAt ?? null,
    premium_plan_tier: me.premiumPlanTier ?? null,
    premium_plan_tier_label_uz: me.premiumPlanTierLabelUz ?? null,
    premium_plan_months: me.premiumPlanMonths ?? null,
  };
}
