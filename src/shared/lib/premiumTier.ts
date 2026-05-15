import type { IUser } from '@/shared/store/authStore';

const KNOWN = new Set(['free', 'go', 'plus', 'pro']);

/** `/auth/me` dan kelgan qiymatni store uchun bir xil qatorga */
export function normalizePremiumPlanTierFromApi(
  raw: string | number | null | undefined,
): string | null {
  if (raw == null || raw === '') return null;
  if (typeof raw === 'number') {
    const byNum: Record<number, string> = {
      0: 'free',
      1: 'go',
      2: 'plus',
      3: 'pro',
    };
    return byNum[raw] ?? null;
  }
  const s = String(raw).trim().toLowerCase();
  if (!s) return null;
  if (s === 'professional' || s === 'prof') return 'pro';
  if (KNOWN.has(s)) return s;
  return null;
}

/** `premiumPlanMonths` → pricing `plan.id` */
function tierFromPremiumMonths(months: number | null | undefined): string | null {
  if (months == null || !Number.isFinite(months)) return null;
  if (months >= 6) return 'pro';
  if (months >= 3) return 'plus';
  if (months >= 1) return 'go';
  return null;
}

/** Pricing kartalaridagi `plan.id` bilan moslashtirish */
export function resolveActivePricingPlanId(user: IUser | null): string {
  if (!user?.premium) return 'free';

  const tier = (user.premium_plan_tier ?? '').trim().toLowerCase();
  if (KNOWN.has(tier)) return tier;
  if (tier === 'professional' || tier === 'prof') return 'pro';

  const fromMonths = tierFromPremiumMonths(user.premium_plan_months);
  if (fromMonths) return fromMonths;

  const label = (user.premium_plan_tier_label_uz ?? '').toLowerCase();
  if (label.includes('kengaytirilgan')) return 'plus';
  if (label.includes('professional')) return 'pro';
  if (label.includes('plus')) return 'plus';
  if (label.includes('go')) return 'go';
  if (label.includes('bepul') || label.includes('free')) return 'free';

  /** Premium bor, lekin tier aniqlanmasa — bepul emas */
  return 'plus';
}
