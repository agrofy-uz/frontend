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

  return showNotification({
    title,
    message: '',
    bg,
    color,
    icon,
    styles: {
      root: {
        width: 400,
        borderRadius: '16px',
        padding: 12,
      },
      icon: {
        width: 48,
        height: 48,
        borderRadius: '12px',
        backgroundColor: `var(--mantine-color-${iconBg.split('.')[0]}-${iconBg.split('.')[1]})`,
        p: '8px',
      },
      closeButton: {
        width: 20,
        height: 20,
        backgroundColor: 'transparent',
        '&:hover': {
          backgroundColor: 'transparent',
          border: 'none',
        },
      },
    },
  });
};

