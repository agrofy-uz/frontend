import dayjs from 'dayjs';
import 'dayjs/locale/uz-latn';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.locale('uz-latn');
dayjs.extend(relativeTime);

export const formatDate = (
  date: string | undefined,
  format: string = 'DD.MM.YYYY'
) => {
  if (!date) return '';
  return dayjs(date).format(format);
};

export const calculateTimeAgo = (targetTime: string) => {
  const now = dayjs();
  const pastTime = dayjs(targetTime);
  const diffInSeconds = now.diff(pastTime, 'second');

  if (diffInSeconds < 60) {
    return `${diffInSeconds} sekund oldin`;
  }

  const diffInMinutes = now.diff(pastTime, 'minute');
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minut oldin`;
  }

  const diffInHours = now.diff(pastTime, 'hour');
  if (diffInHours < 24) {
    return `${diffInHours} soat oldin`;
  }

  const diffInDays = now.diff(pastTime, 'day');
  if (diffInDays < 30) {
    return `${diffInDays} kun oldin`;
  }

  const diffInMonths = now.diff(pastTime, 'month');
  if (diffInMonths < 12) {
    return `${diffInMonths} oy oldin`;
  }

  const diffInYears = now.diff(pastTime, 'year');
  return `${diffInYears} yil oldin`;
};

export function normalizeBackendIso(iso: string): string {
  // .NET: 2026-05-08T05:59:55.4860585+00:00 -> 2026-05-08T05:59:55.486+00:00
  return iso.trim().replace(/(\.\d{3})\d+(?=[Z+-]|$)/i, '$1');
}

export function parseBackendInstantMs(
  iso: string | null | undefined
): number | null {
  if (!iso?.trim()) return null;
  const raw = iso.trim();
  let ms = Date.parse(raw);
  if (!Number.isNaN(ms)) return ms;
  ms = Date.parse(normalizeBackendIso(raw));
  return Number.isNaN(ms) ? null : ms;
}

