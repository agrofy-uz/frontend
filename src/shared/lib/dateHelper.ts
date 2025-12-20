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

