import { readMeBool } from '@/shared/api/services/auth/authMePayload';
import { useAuthStore } from '@/shared/store/authStore';

export type ListingLimits = {
  productsLimit: boolean;
  servicesLimit: boolean;
};

function hasLimitField(payload: object, camel: string, pascal: string): boolean {
  const r = payload as Record<string, unknown>;
  return (
    Object.prototype.hasOwnProperty.call(r, camel) ||
    Object.prototype.hasOwnProperty.call(r, pascal)
  );
}

/** `/auth/me`, yaratish javobi va boshqa payloadlardan limit flaglari */
export function parseListingLimitsFromPayload(
  payload: unknown,
): Partial<ListingLimits> | null {
  if (!payload || typeof payload !== 'object') return null;
  const raw = payload as object;

  const partial: Partial<ListingLimits> = {};

  if (hasLimitField(raw, 'productsLimit', 'ProductsLimit')) {
    partial.productsLimit = readMeBool(raw, 'productsLimit', 'ProductsLimit');
  }
  if (hasLimitField(raw, 'servicesLimit', 'ServicesLimit')) {
    partial.servicesLimit = readMeBool(raw, 'servicesLimit', 'ServicesLimit');
  }

  return Object.keys(partial).length > 0 ? partial : null;
}

/** Store: `/auth/me` yoki create javobidagi limitlarni yangilash */
export function applyListingLimitsFromPayload(payload: unknown): void {
  const parsed = parseListingLimitsFromPayload(payload);
  if (!parsed) return;

  const { user, updateUser } = useAuthStore.getState();
  if (!user) return;

  updateUser({
    ...user,
    ...(parsed.productsLimit !== undefined
      ? { products_limit: parsed.productsLimit }
      : {}),
    ...(parsed.servicesLimit !== undefined
      ? { services_limit: parsed.servicesLimit }
      : {}),
  });
}

export function readListingLimitsFromMe(me: object): ListingLimits {
  return {
    productsLimit: readMeBool(me, 'productsLimit', 'ProductsLimit'),
    servicesLimit: readMeBool(me, 'servicesLimit', 'ServicesLimit'),
  };
}
