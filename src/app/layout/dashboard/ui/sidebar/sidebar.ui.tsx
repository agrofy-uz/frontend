import { NavLink, Stack, Box, Avatar, Badge, Text, Flex } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { FaHome } from 'react-icons/fa';
import { Logo } from '../logo';
import styles from './sidebar.module.css';
import { IoChatbubbleOutline } from 'react-icons/io5';
import { FaRegMap } from 'react-icons/fa6';
import { FaChartColumn } from 'react-icons/fa6';
import { Drower } from './ui/drower';
import { useAuthStore } from '@/shared/store/authStore';

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar = ({ collapsed }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser } = useAuthStore();
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);

  // User ma'lumotlari
  const user = {
    name: authUser
      ? `${authUser.first_name || ''} ${authUser.last_name || ''}`.trim() ||
        'User'
      : 'User',
    phone: authUser?.phone_number || '',
    avatar: null, // Avatar URL yoki null
  };

  // Avatar uchun bosh harflar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const navItems = [
    { label: 'Dashboard', icon: FaHome, path: '/dashboard/home' },
    { label: 'AI Assistant', icon: IoChatbubbleOutline, path: '/dashboard/ai' },
    { label: 'Fields', icon: FaRegMap, path: '/dashboard/fields' },
    // { label: 'Market', icon: FaShoppingCart, path: '/dashboard/market' },
    { label: 'Reports', icon: FaChartColumn, path: '/dashboard/reports' },
  ];

  return (
    <Stack gap={0} h="100%">
      <Box h={60}>
        <Logo collapsed={collapsed} />
      </Box>
      <Stack gap={4} p="xs" px="sm" style={{ flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(item.path + '/');
          return (
            <NavLink
              key={item.path}
              label={
                collapsed ? undefined : (
                  <span className={styles.sidebarLabel}>{item.label}</span>
                )
              }
              leftSection={<Icon size={20} className={styles.sidebarIcon} />}
              active={isActive}
              onClick={() => navigate(item.path)}
              className={styles.sidebarNavLink}
              style={{
                borderRadius: 'var(--mantine-radius-md)',
              }}
              styles={{
                root: {
                  height: 44,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  paddingLeft: collapsed ? 0 : undefined,
                  paddingRight: collapsed ? 0 : undefined,
                },
                body: {
                  marginTop: 4,
                  display: collapsed ? 'none' : 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                },
                section: {
                  marginLeft: collapsed ? 0 : undefined,
                  marginRight: collapsed ? 0 : undefined,
                },
                label: {
                  display: collapsed ? 'none' : 'block',
                  transition: 'opacity 0.15s ease',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                },
              }}
            />
          );
        })}
      </Stack>
      <Drower
        opened={drawerOpened}
        onClose={closeDrawer}
        target={
          collapsed ? (
            <Box
              mx="sm"
              mb={10}
              style={{
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
              }}
              onClick={openDrawer}
            >
              <Avatar src={user.avatar} size="md" radius="md">
                {getInitials(user.name)}
              </Avatar>
            </Box>
          ) : (
            <Flex
              justify="space-between"
              align="center"
              p="5px"
              gap="md"
              mx="sm"
              mb={10}
              className={styles.profileCard}
              style={{
                borderRadius: 'var(--mantine-radius-md)',
                cursor: 'pointer',
              }}
              onClick={openDrawer}
            >
              <Flex gap="md" align="center" style={{ flex: 1, minWidth: 0 }}>
                <Avatar src={user.avatar} size="md" radius="md">
                  {getInitials(user.name)}
                </Avatar>
                <Flex direction="column" gap="0">
                  <Flex direction="row" gap="5px">
                    {user.name.split(' ').map((part, index) => (
                      <Text
                        key={index}
                        fz="14px"
                        fw={500}
                        className={styles.profileName}
                      >
                        {part}
                      </Text>
                    ))}
                  </Flex>
                  <Text fz="12px" className={styles.profileStatus}>
                    Free
                  </Text>
                </Flex>
              </Flex>
              <Badge
                size="sm"
                className={styles.profileBadge}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate('/dashboard/pricing');
                }}
                style={{ cursor: 'pointer' }}
              >
                Upgrade
              </Badge>
            </Flex>
          )
        }
      />
    </Stack>
  );
};

export default Sidebar;
