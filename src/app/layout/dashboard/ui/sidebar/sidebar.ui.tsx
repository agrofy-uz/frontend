import { NavLink, Stack, Box, Avatar, Badge, Text, Flex } from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { TbClipboardList } from 'react-icons/tb';
import { FaHome } from 'react-icons/fa';
import { Logo } from '../logo';
import styles from './sidebar.module.css';
import { IoChatbubbleOutline } from 'react-icons/io5';
import { MdOutlineMiscellaneousServices } from 'react-icons/md';
import { FaStore } from 'react-icons/fa6';
import { Drower } from './ui/drower';
import { useMobileDashboardDrawer } from '@/app/layout/dashboard/mobile-dashboard-drawer.context';
import { useAuthStore } from '@/shared/store/authStore';
import { parseBackendInstantMs } from '@/shared/lib/dateHelper';
import { AnimatePresence, motion } from 'framer-motion';
import { AiSidebar } from './ui/ai';
import { ServicesSidebar } from './ui/services';
import { useEffect, useRef } from 'react';

type SidebarShellMode = 'main' | 'ai' | 'services';

const PREMIUM_UPGRADE_BADGE_WINDOW_MS = 3 * 24 * 60 * 60 * 1000;

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar = ({ collapsed }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const mobileDrawer = useMobileDashboardDrawer();
  const { user: authUser } = useAuthStore();
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const isAiMode =
    location.pathname === '/dashboard/ai' ||
    location.pathname.startsWith('/dashboard/ai/');

  const isServicesMode =
    location.pathname === '/dashboard/services' ||
    location.pathname.startsWith('/dashboard/services/');

  const isMarketMode =
    location.pathname === '/dashboard/market' ||
    location.pathname.startsWith('/dashboard/market/');

  /** Profil + Drower — hozircha xizmatlar va mahsulotlar rejimida ko‘rinmaydi */
  const showProfileDrawer = !isServicesMode && !isMarketMode;

  const shellMode: SidebarShellMode = isAiMode
    ? 'ai'
    : isServicesMode
      ? 'services'
      : 'main';

  const prevShellModeRef = useRef<SidebarShellMode>(shellMode);
  const prevShellMode = prevShellModeRef.current;

  useEffect(() => {
    prevShellModeRef.current = shellMode;
  }, [shellMode]);

  useEffect(() => {
    if (!showProfileDrawer) closeDrawer();
  }, [showProfileDrawer, closeDrawer]);

  // User ma'lumotlari
  const user = {
    name: authUser
      ? `${authUser.first_name || ''} ${authUser.last_name || ''}`.trim() ||
        'Foydalanuvchi'
      : 'Foydalanuvchi',
    phone: authUser?.phone_number || '',
    avatar: authUser?.photo_url || null,
    planLabel: authUser?.premium_plan_tier_label_uz?.trim() || 'Bepul tarif',
  };

  const shouldShowUpgradeBadge = (() => {
    // Null bo'lsa ham badge chiqsin (masalan: free tier)
    const expiresMs = parseBackendInstantMs(authUser?.premium_expires_at);
    if (expiresMs == null) return true;
    return expiresMs - Date.now() <= PREMIUM_UPGRADE_BADGE_WINDOW_MS;
  })();

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
    { label: 'Boshqaruv paneli', icon: FaHome, path: '/dashboard' },
    { label: 'AI yordamchi', icon: IoChatbubbleOutline, path: '/dashboard/ai' },
    // { label: 'Dalar', icon: FaRegMap, path: '/dashboard/fields' },
    {
      label: 'Xizmatlar',
      icon: MdOutlineMiscellaneousServices,
      path: '/dashboard/services',
    },
    { label: 'Mahsulotlar', icon: FaStore, path: '/dashboard/market' },
    // { label: 'Hisobotlar', icon: FaChartColumn, path: '/dashboard/reports' },
    {
      label: "Mening e'lonlarim",
      icon: TbClipboardList,
      path: '/dashboard/my-ads',
    },
  ];

  return (
    <Stack gap={0} h="100%">
      <Box h={60}>
        <Logo collapsed={collapsed} />
      </Box>
      <Box className={styles.navArea}>
        {/* mode="sync" -> eski chiqayotganda yangi ham bir vaqtda kiradi */}
        <AnimatePresence mode="sync" initial={false}>
          {shellMode === 'ai' ? (
            <motion.div
              key="ai"
              initial={{
                x: prevShellMode === 'services' ? -280 : 280,
                opacity: 0,
              }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 280, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              style={{ position: 'absolute', inset: 0, height: '100%' }}
            >
              <AiSidebar collapsed={collapsed} />
            </motion.div>
          ) : shellMode === 'services' ? (
            <motion.div
              key="services"
              initial={{
                x: prevShellMode === 'ai' ? -280 : 280,
                opacity: 0,
              }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 280, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              style={{ position: 'absolute', inset: 0, height: '100%' }}
            >
              <ServicesSidebar collapsed={collapsed} />
            </motion.div>
          ) : (
            <motion.div
              key="main"
              initial={{
                x:
                  prevShellMode === 'ai' || prevShellMode === 'services'
                    ? -280
                    : 280,
                opacity: 0,
              }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              style={{ position: 'absolute', inset: 0, height: '100%' }}
            >
              <Stack gap={4} p="xs" px="sm" style={{ height: '100%' }}>
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
                          <span className={styles.sidebarLabel}>
                            {item.label}
                          </span>
                        )
                      }
                      leftSection={
                        <Icon size={20} className={styles.sidebarIcon} />
                      }
                      active={isActive}
                      onClick={() => {
                        const keepOpenOnMobile =
                          item.path === '/dashboard/ai' ||
                          item.path === '/dashboard/services';
                        if (mobileDrawer?.isMobile && !keepOpenOnMobile) {
                          mobileDrawer.closeMobileDrawer();
                        }
                        navigate(item.path);
                      }}
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
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
      {showProfileDrawer && (
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
                      {user.planLabel}
                    </Text>
                  </Flex>
                </Flex>
                {shouldShowUpgradeBadge && (
                  <Badge
                    size="sm"
                    className={styles.profileBadge}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/dashboard/pricing');
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    Tarifni yangilash
                  </Badge>
                )}
              </Flex>
            )
          }
        />
      )}
    </Stack>
  );
};

export default Sidebar;
