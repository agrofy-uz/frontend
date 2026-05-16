import {
  NavLink,
  Stack,
  Box,
  Avatar,
  Badge,
  Text,
  Flex,
  ActionIcon,
} from '@mantine/core';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';
import { TbClipboardList, TbDotsVertical } from 'react-icons/tb';
import { FaHome } from 'react-icons/fa';
import { Logo } from '../logo';
import styles from './sidebar.module.css';
import { IoChatbubbleOutline } from 'react-icons/io5';
import { MdOutlineMiscellaneousServices } from 'react-icons/md';
import { FaStore } from 'react-icons/fa6';
import { Drower } from './ui/drower';
import { useMobileDashboardDrawer } from '@/app/layout/dashboard/mobile-dashboard-drawer.context';
import { useAuthStore } from '@/shared/store/authStore';
import { usePricingModalStore } from '@/shared/store/pricingModalStore';
import { parseBackendInstantMs } from '@/shared/lib/dateHelper';
import { AnimatePresence, motion } from 'framer-motion';
import { AiSidebar } from './ui/ai';
import { ServicesSidebar } from './ui/services';
import { MarketSidebar } from './ui/market';
import { useEffect, useRef } from 'react';

type SidebarShellMode = 'main' | 'ai' | 'services' | 'market';

const PREMIUM_UPGRADE_BADGE_WINDOW_MS = 3 * 24 * 60 * 60 * 1000;

interface SidebarProps {
  collapsed: boolean;
}

const Sidebar = ({ collapsed }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const openPricingModal = usePricingModalStore((s) => s.open);
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
      : isMarketMode
        ? 'market'
        : 'main';

  const prevShellModeRef = useRef<SidebarShellMode>(shellMode);
  const prevShellMode = prevShellModeRef.current;

  useEffect(() => {
    prevShellModeRef.current = shellMode;
  }, [shellMode]);

  useEffect(() => {
    if (!showProfileDrawer) closeDrawer();
  }, [showProfileDrawer, closeDrawer]);

  const firstName = authUser?.first_name?.trim() ?? '';
  const lastName = authUser?.last_name?.trim() ?? '';

  // User ma'lumotlari
  const user = {
    /** Sidebar profil qatorida — faqat ism (bold) */
    displayName: firstName || 'Foydalanuvchi',
    name:
      [firstName, lastName].filter(Boolean).join(' ').trim() || 'Foydalanuvchi',
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

  const normalizedPathname =
    location.pathname.length > 1 && location.pathname.endsWith('/')
      ? location.pathname.slice(0, -1)
      : location.pathname;

  const isActiveNavItem = (path: string): boolean => {
    switch (path) {
      case '/dashboard':
        // "Boshqaruv paneli" faqat dashboard root'da active bo'ladi.
        return normalizedPathname === '/dashboard';
      case '/dashboard/ai':
        return (
          normalizedPathname === '/dashboard/ai' ||
          normalizedPathname.startsWith('/dashboard/ai/')
        );
      case '/dashboard/services':
        return (
          normalizedPathname === '/dashboard/services' ||
          normalizedPathname.startsWith('/dashboard/services/')
        );
      case '/dashboard/market':
        return (
          normalizedPathname === '/dashboard/market' ||
          normalizedPathname.startsWith('/dashboard/market/')
        );
      default:
        return (
          normalizedPathname === path ||
          normalizedPathname.startsWith(path + '/')
        );
    }
  };

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
                x:
                  prevShellMode === 'services' || prevShellMode === 'market'
                    ? -280
                    : 280,
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
                x:
                  prevShellMode === 'ai' || prevShellMode === 'market'
                    ? -280
                    : 280,
                opacity: 0,
              }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 280, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              style={{ position: 'absolute', inset: 0, height: '100%' }}
            >
              <ServicesSidebar collapsed={collapsed} />
            </motion.div>
          ) : shellMode === 'market' ? (
            <motion.div
              key="market"
              initial={{
                x:
                  prevShellMode === 'ai' || prevShellMode === 'services'
                    ? -280
                    : 280,
                opacity: 0,
              }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 280, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              style={{ position: 'absolute', inset: 0, height: '100%' }}
            >
              <MarketSidebar collapsed={collapsed} />
            </motion.div>
          ) : (
            <motion.div
              key="main"
              initial={{
                x:
                  prevShellMode === 'ai' ||
                  prevShellMode === 'services' ||
                  prevShellMode === 'market'
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
                      active={isActiveNavItem(item.path)}
                      onClick={() => {
                        const keepOpenOnMobile =
                          item.path === '/dashboard/ai' ||
                          item.path === '/dashboard/services' ||
                          item.path === '/dashboard/market';
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
                    <Text
                      fz="14px"
                      fw={700}
                      className={styles.profileName}
                      lineClamp={1}
                    >
                      {user.displayName}
                    </Text>

                    <Text fz="12px" className={styles.profileStatus}>
                      {user.planLabel}
                    </Text>
                  </Flex>
                </Flex>
                <Flex gap="xs" align="center" style={{ flexShrink: 0 }}>
                  {shouldShowUpgradeBadge && (
                    <Badge
                      size="sm"
                      className={styles.profileBadge}
                      onClick={(e) => {
                        e.stopPropagation();
                        openPricingModal();
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      Yangilash
                    </Badge>
                  )}
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    size="sm"
                    aria-label="Profil menyusi"
                  >
                    <TbDotsVertical size={18} />
                  </ActionIcon>
                </Flex>
              </Flex>
            )
          }
        />
      )}
    </Stack>
  );
};

export default Sidebar;
