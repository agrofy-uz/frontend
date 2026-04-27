import { Box, Flex, Group, Text, ActionIcon, Badge } from '@mantine/core';
import { IoIosNotifications } from 'react-icons/io';
import { useLocation } from 'react-router-dom';
import { ThemeToggle } from '@/app/layout/footer/ui/theme-toggle';
import { SearchInput } from '@/pages/dashboard/pages/services/ui/search-input/search-input.ui';
import { useMediaQuery } from '@mantine/hooks';

const isServicesRoute = (pathname: string) =>
  pathname === '/dashboard/services' ||
  pathname.startsWith('/dashboard/services/');

const DashboardHeader = () => {
  const location = useLocation();
  const showServicesSearch = isServicesRoute(location.pathname);
  const isMobile = useMediaQuery('(max-width: 1000px)');
  const getPageName = () => {
    const pathname = location.pathname;
    if (pathname === '/dashboard' || pathname === '/dashboard') {
      return 'Boshqaruv paneli';
    }
    if (pathname === '/dashboard/ai') return 'AI yordamchi';
    if (pathname === '/dashboard/services') return 'Xizmatlar';
    if (pathname === '/dashboard/market') return 'Mahsulotlar';
    if (pathname === '/dashboard/reports') return 'Hisobotlar';
    if (pathname === '/dashboard/my-ads') return "Mening e'lonlarim";
    if (pathname === '/dashboard/settings') return 'Sozlamalar';
    if (pathname === '/dashboard/profile') return 'Profil';
    if (pathname === '/dashboard/pricing') return 'Tariflar';
    return 'Boshqaruv paneli';
  };

  return (
    <Flex
      align="center"
      justify="space-between"
      gap="md"
      wrap="nowrap"
      w="100%"
      style={{ minWidth: 0 }}
    >
      <Box miw={0} style={{ flex: '0 1 auto' }}>
        <Text
          fw={700}
          fz={isMobile ? 'md' : 'lg'}
          className="textPrimary"
          lineClamp={1}
        >
          {getPageName()}
        </Text>
      </Box>

      {showServicesSearch && (
        <Box
          visibleFrom="md"
          miw={0}
          style={{
            flex: '1 1 auto',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            maxWidth: 'min(100%, 28rem)',
          }}
        >
          <SearchInput />
        </Box>
      )}

      <Group gap="md" wrap="nowrap" style={{ flexShrink: 0 }}>
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
    </Flex>
  );
};

export default DashboardHeader;
