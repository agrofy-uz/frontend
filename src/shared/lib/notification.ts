import { showNotification } from '@mantine/notifications';

interface NotificationProps {
  title: string;
  icon: React.ReactNode;
  type?: 'success' | 'error' | 'warning' | 'info';
}
export const openNotification = ({
  title,
  icon,
  type = 'success',
}: NotificationProps) => {
  const bg =
    type === 'success'
      ? 'green.1'
      : type === 'error'
        ? 'red.1'
        : type === 'warning'
          ? 'yellow.1'
          : 'blue.1';
  const color =
    type === 'success'
      ? 'green.10'
      : type === 'error'
        ? 'red.10'
        : type === 'warning'
          ? 'yellow.10'
          : 'blue.10';
  const iconBg =
    type === 'success'
      ? 'green.2'
      : type === 'error'
        ? 'red.2'
        : type === 'warning'
          ? 'yellow.2'
          : 'blue.2';

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

