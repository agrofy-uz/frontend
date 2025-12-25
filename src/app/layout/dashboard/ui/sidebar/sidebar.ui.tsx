import { NavLink, Stack, Box, Flex } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaHome, FaCog } from 'react-icons/fa';
import { Logo } from '../logo';
import styles from './sidebar.module.css';
import { IoChatbubbleOutline } from 'react-icons/io5';
import { FaRegMap } from 'react-icons/fa6';
import { FaChartColumn } from 'react-icons/fa6';

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar = ({ collapsed }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Dashboard', icon: FaHome, path: '/dashboard' },
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
      <Flex justify="start" align="center" py="sm" px="sm">
        <NavLink
          label={<span className={styles.settingsLabel}>sozlamalar</span>}
          leftSection={<FaCog size={20} className={styles.settingsIcon} />}
          className={styles.settingsNavLink}
          style={{
            borderRadius: 'var(--mantine-radius-md)',
            width: '100%',
          }}
        />
      </Flex>
    </Stack>
  );
};

export default Sidebar;
