import { Group, Text, ActionIcon, Badge } from '@mantine/core';
import { IoIosNotifications } from 'react-icons/io';
import { useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/app/layout/footer/ui/theme-toggle';

const DashboardHeader = () => {
  const location = useLocation();

  const getPageName = () => {
    const pathname = location.pathname;
    if (pathname === '/dashboard' || pathname === '/dashboard/home') {
      return 'Boshqaruv paneli';
    }
    if (pathname === '/dashboard/ai') return 'AI yordamchi';
    if (pathname === '/dashboard/fields') return 'Dalar';
    if (pathname === '/dashboard/market') return 'Bozor';
    if (pathname === '/dashboard/reports') return 'Hisobotlar';
    if (pathname === '/dashboard/settings') return 'Sozlamalar';
    if (pathname === '/dashboard/profile') return 'Profil';
    if (pathname === '/dashboard/pricing') return 'Tariflar';
    return 'Boshqaruv paneli';
  };

  return (
    <Group h="100%" justify="space-between" style={{ width: '100%' }}>
      <Group>
        <Text fw={700} fz="lg" className="textPrimary">
          {getPageName()}
        </Text>
      </Group>

      <Group gap="md">
        <ActionIcon variant="subtle" size="lg" style={{ position: 'relative' }}>
          <IoIosNotifications size={24} className="textPrimary" />
          <Badge
            size="xs"
            circle
            color="green"
            style={{
              position: 'absolute',
              top: -0,
              right: 0,
              minWidth: 14,
              height: 14,
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            3
          </Badge>
        </ActionIcon>
        <ThemeToggle />
      </Group>
    </Group>
  );
};

export default DashboardHeader;
