import { showNotification } from '@mantine/notifications';

interface NotificationProps {
  title: string;
  icon: React.ReactNode;
  type?: 'success' | 'error' | 'warning' | 'info';
}

// Dark mode'ni aniqlash funksiyasi
const isDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  return (
    document.documentElement.getAttribute('data-mantine-color-scheme') ===
    'dark'
  );
};

export const openNotification = ({
  title,
  icon,
  type = 'success',
}: NotificationProps) => {
  const isDark = isDarkMode();

  // Light mode uchun ranglar
  const lightBg =
    type === 'success'
      ? 'green.1'
      : type === 'error'
        ? 'red.1'
        : type === 'warning'
          ? 'yellow.1'
          : 'blue.1';
  const lightColor =
    type === 'success'
      ? 'green.10'
      : type === 'error'
        ? 'red.10'
        : type === 'warning'
          ? 'yellow.10'
          : 'blue.10';
  const lightIconBg =
    type === 'success'
      ? 'green.2'
      : type === 'error'
        ? 'red.2'
        : type === 'warning'
          ? 'yellow.2'
          : 'blue.2';

  // Dark mode uchun ranglar
  const darkBg = 'dark.7'; // Qorong'u fon
  const darkColor =
    type === 'success'
      ? 'green.4'
      : type === 'error'
        ? 'red.4'
        : type === 'warning'
          ? 'yellow.4'
          : 'blue.4';
  const darkIconBg =
    type === 'success'
      ? 'green.8'
      : type === 'error'
        ? 'red.8'
        : type === 'warning'
          ? 'yellow.8'
          : 'blue.8';

  // Dark mode'ga qarab ranglarni tanlash
  const bg = isDark ? darkBg : lightBg;
  const color = isDark ? darkColor : lightColor;
  const iconBg = isDark ? darkIconBg : lightIconBg;

  // Mobile uchun responsive o'lchamlarni aniqlash
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return showNotification({
    title,
    message: '',
    bg,
    color,
    icon,
    styles: {
      root: {
        width: isMobile ? 'calc(100vw - 32px)' : 400,
        maxWidth: isMobile ? 'calc(100vw - 32px)' : 400,
        borderRadius: isMobile ? '12px' : '16px',
        padding: isMobile ? 10 : 12,
      },
      icon: {
        width: isMobile ? 36 : 48,
        height: isMobile ? 36 : 48,
        borderRadius: isMobile ? '10px' : '12px',
        backgroundColor: `var(--mantine-color-${iconBg.split('.')[0]}-${iconBg.split('.')[1]})`,
        padding: isMobile ? '6px' : '8px',
      },
      title: {
        fontSize: isMobile ? '14px' : '16px',
      },
      closeButton: {
        width: isMobile ? 18 : 20,
        height: isMobile ? 18 : 20,
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: 'transparent',
          border: 'none',
        },
      },
    },
  });
};
