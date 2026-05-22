import {
  Popover,
  Stack,
  Box,
  Flex,
  Avatar,
  Text,
  NavLink,
} from '@mantine/core';
import { FaCog, FaSignOutAlt } from 'react-icons/fa';
import { HiLightningBolt, HiOutlineSupport } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useMobileDashboardDrawer } from '@/app/layout/dashboard/mobile-dashboard-drawer.context';
import { logoutAuth } from '@/shared/api';
import { useAuthStore } from '@/shared/store/authStore';
import { useSettingsModalStore } from '@/shared/store/settingsModalStore';
import { usePricingModalStore } from '@/shared/store/pricingModalStore';
import { formatPhoneNumber } from '@/shared/lib/formatNumber';
import { openTelegramHelp } from '@/shared/lib/telegramNavigation';
import { localStorageHelper } from '@/shared/lib/localStorage';
import styles from './drower.module.css';

interface DrowerProps {
  opened: boolean;
  onClose: () => void;
  target: React.ReactNode;
}

function Drower({ opened, onClose, target }: DrowerProps) {
  const navigate = useNavigate();
  const mobileDrawer = useMobileDashboardDrawer();
  const openSettingsModal = useSettingsModalStore((s) => s.open);
  const openPricingModal = usePricingModalStore((s) => s.open);
  const { user: authUser, logout, refreshToken } = useAuthStore();

  // User ma'lumotlari
  const user = {
    username: authUser?.username || '',
    name: authUser
      ? `${authUser.first_name || ''} ${authUser.last_name || ''}`.trim() ||
        'Foydalanuvchi'
      : 'Foydalanuvchi',
    phone: authUser?.phone_number || '',
    avatar: authUser?.photo_url || null,
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

  const handleUpgrade = () => {
    if (mobileDrawer?.isMobile) {
      mobileDrawer.closeMobileDrawer();
    }
    onClose();
    openPricingModal();
  };

  const handleProfile = () => {
    if (mobileDrawer?.isMobile) {
      mobileDrawer.closeMobileDrawer();
    }
    onClose();
    navigate('/dashboard/profile');
  };

  const handleSettings = () => {
    openSettingsModal();
    onClose();
  };

  const handleHelp = (event: React.MouseEvent<HTMLElement>) => {
    if (mobileDrawer?.isMobile) {
      mobileDrawer.closeMobileDrawer();
    }
    onClose();
    openTelegramHelp(event);
  };

  const handleLogout = async () => {
    if (refreshToken) {
      try {
        await logoutAuth(refreshToken);
      } catch {
        // Server logout xatolik bersa ham local sessionni tozalaymiz
      }
    }
    logout();
    localStorageHelper.clear();
    onClose();
    navigate('/');
  };

  return (
    <Popover
      opened={opened}
      onChange={onClose}
      position="top"
      offset={8}
      withArrow
      shadow="md"
      width={260}
      classNames={{ dropdown: styles.popoverDropdown }}
      styles={{
        dropdown: {
          padding: 0,
          borderRadius: 'var(--mantine-radius-md)',
        },
      }}
    >
      <Popover.Target>{target}</Popover.Target>
      <Popover.Dropdown>
        <Stack gap={0} className={styles.dropdown}>
          {/* Header - Avatar, Username va Phone */}
          <Box
            p="md"
            className={styles.header}
            onClick={handleProfile}
            style={{
              cursor: 'pointer',
              borderTopLeftRadius: 'var(--mantine-radius-md)',
              borderTopRightRadius: 'var(--mantine-radius-md)',
            }}
          >
            <Flex align="center" gap="md">
              <Avatar src={user.avatar} size={48} radius="md">
                {getInitials(user.name)}
              </Avatar>
              <Box style={{ flex: 1 }}>
                <Text fw={600} size="md" className={styles.username}>
                  {user.username.trim() ? `@${user.username}` : user.name}
                </Text>
                <Text size="sm" className={styles.phoneText}>
                  {user.phone.trim()
                    ? formatPhoneNumber(user.phone)
                    : "Telefon raqam yo'q"}
                </Text>
              </Box>
            </Flex>
          </Box>

          {/* Tarif */}
          <Box px="xs" pt="xs">
            <NavLink
              label="Tarifni yangilash"
              leftSection={<HiLightningBolt size={18} />}
              onClick={handleUpgrade}
              className={styles.navLink}
            />
          </Box>

          {/* Settings */}
          <Box px="xs">
            <NavLink
              label="Sozlamalar"
              leftSection={<FaCog size={18} />}
              onClick={handleSettings}
              className={styles.navLink}
            />
          </Box>

          {/* Yordam — Telegram help (pricing dagi «biz bilan bog'laning») */}
          <Box px="xs">
            <NavLink
              label="Yordam"
              leftSection={<HiOutlineSupport size={18} />}
              onClick={handleHelp}
              className={styles.navLink}
            />
          </Box>

          {/* Log out */}
          <Box px="xs" pb="xs">
            <NavLink
              label="Chiqish"
              leftSection={<FaSignOutAlt size={18} />}
              onClick={handleLogout}
              className={`${styles.navLink} ${styles.logoutLink}`}
              styles={{
                root: {
                  transition: 'background-color 0.2s ease',
                },
                label: {
                  transition: 'color 0.2s ease',
                },
                section: {
                  transition: 'color 0.2s ease',
                },
              }}
            />
          </Box>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

export default Drower;
