import { useAuthStore } from '@/shared/store/authStore';

function readField(
  o: Record<string, unknown>,
  camel: string,
  pascal: string,
): unknown {
  if (Object.prototype.hasOwnProperty.call(o, camel) && o[camel] !== undefined) {
    return o[camel];
  }
  if (Object.prototype.hasOwnProperty.call(o, pascal) && o[pascal] !== undefined) {
    return o[pascal];
  }
  return undefined;
}

function readBool(o: Record<string, unknown>, camel: string, pascal: string): boolean {
  const v = readField(o, camel, pascal);
  if (typeof v === 'boolean') return v;
  if (typeof v === 'string') return v.toLowerCase() === 'true';
  if (typeof v === 'number') return v !== 0;
  return false;
}

function pickUntilString(value: unknown): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  return value.trim();
}

/** `/auth/me` yoki chat javobidagi `aiChatLimited` */
export function parseAiChatLimited(raw: unknown): {
  active: boolean;
  limitedUntil: string | null;
} | null {
  if (raw == null) return null;

  if (typeof raw === 'string') {
    const until = pickUntilString(raw);
    return { active: Boolean(until), limitedUntil: until };
  }

  if (typeof raw === 'boolean') {
    return raw ? { active: true, limitedUntil: null } : null;
  }

  if (typeof raw !== 'object') return null;

  const o = raw as Record<string, unknown>;
  const until =
    pickUntilString(readField(o, 'limitedUntil', 'LimitedUntil')) ??
    pickUntilString(readField(o, 'availableAt', 'AvailableAt')) ??
    pickUntilString(readField(o, 'resetAt', 'ResetAt')) ??
    pickUntilString(readField(o, 'until', 'Until')) ??
    pickUntilString(readField(o, 'limitedUntilUtc', 'LimitedUntilUtc'));

  const active =
    readBool(o, 'isLimited', 'IsLimited') ||
    readBool(o, 'limited', 'Limited') ||
    readBool(o, 'isActive', 'IsActive') ||
    Boolean(until);

  if (!active) return null;
  return { active: true, limitedUntil: until };
}

/** Javob obyektidan `aiChatLimited` ni qidirish */
export function parseAiChatLimitedFromPayload(payload: unknown): {
  active: boolean;
  limitedUntil: string | null;
} | null {
  if (!payload || typeof payload !== 'object') return null;
  const p = payload as Record<string, unknown>;
  const nested =
    parseAiChatLimited(p.aiChatLimited ?? p.AiChatLimited) ??
    parseAiChatLimited(
      p.aiChatLimitedUntil ?? p.AiChatLimitedUntil,
    );
  if (nested) return nested;

  const topUntil = pickUntilString(
    p.aiChatLimitedUntil ?? p.AiChatLimitedUntil,
  );
  if (topUntil) return { active: true, limitedUntil: topUntil };

  return null;
}

export function isAiChatSendBlocked(
  limitedUntil: string | null | undefined,
): boolean {
  if (limitedUntil === '') return true;
  if (!limitedUntil?.trim()) return false;
  const ms = Date.parse(limitedUntil.trim());
  if (Number.isNaN(ms)) return true;
  return Date.now() < ms;
}

export function formatAiChatLimitUntil(
  iso: string,
  locale = 'uz-UZ',
  timeZone = 'Asia/Tashkent',
): string {
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) return iso;
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone,
  }).format(new Date(ms));
}

export type AiChatLimitRemaining = {
  totalMs: number;
  hours: number;
  minutes: number;
};

/** Backend `limitedUntil` gacha qolgan vaqt (soat / daqiqa) */
export function getAiChatLimitRemaining(
  limitedUntil: string | null | undefined,
  now = Date.now(),
): AiChatLimitRemaining | null {
  if (!limitedUntil?.trim()) return null;
  const endMs = Date.parse(limitedUntil.trim());
  if (Number.isNaN(endMs)) return null;
  const totalMs = Math.max(0, endMs - now);
  const hours = Math.floor(totalMs / 3_600_000);
  const minutes = Math.floor((totalMs % 3_600_000) / 60_000);
  return { totalMs, hours, minutes };
}

export function formatAiChatLimitCountdown(
  limitedUntil: string | null | undefined,
  now = Date.now(),
): string {
  const remaining = getAiChatLimitRemaining(limitedUntil, now);
  if (!remaining) return '—';
  if (remaining.totalMs <= 0) return 'tez orada';

  const { hours, minutes } = remaining;

  // 1 soatdan kam — faqat daqiqa (masalan: «20 daqiqa», soat yo‘q)
  if (hours < 1) {
    if (minutes > 0) return `${minutes} daqiqa`;
    return '1 daqiqadan kam';
  }

  // 1 soat va undan ko‘p — daqiqa faqat qoldiq bo‘lsa
  if (minutes > 0) return `${hours} soat ${minutes} daqiqa`;
  return `${hours} soat`;
}

/** Store: chat yoki `/auth/me` dan limit yangilash */
export function applyAiChatLimitedFromPayload(payload: unknown): void {
  const parsed = parseAiChatLimitedFromPayload(payload);
  if (!parsed?.active) return;

  const { user, updateUser } = useAuthStore.getState();
  if (!user) return;

  updateUser({
    ...user,
    ai_chat_limited_until: parsed.limitedUntil ?? '',
  });
}

export function applyAiChatLimitedUntil(until: string | null): void {
  const { user, updateUser } = useAuthStore.getState();
  if (!user) return;
  updateUser({
    ...user,
    ai_chat_limited_until: until,
  });
}

export class AiChatLimitError extends Error {
  readonly limitedUntil: string | null;

  constructor(message: string, limitedUntil: string | null) {
    super(message);
    this.name = 'AiChatLimitError';
    this.limitedUntil = limitedUntil;
  }
}
