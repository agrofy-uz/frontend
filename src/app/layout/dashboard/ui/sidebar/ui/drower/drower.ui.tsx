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
import { HiLightningBolt } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/store/authStore';
import styles from './drower.module.css';

interface DrowerProps {
  opened: boolean;
  onClose: () => void;
  target: React.ReactNode;
}

function Drower({ opened, onClose, target }: DrowerProps) {
  const navigate = useNavigate();
  const { user: authUser } = useAuthStore();

  // User ma'lumotlari
  const user = {
    username: authUser?.username || '',
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

  const handleUpgrade = () => {
    navigate('/dashboard/pricing');
    onClose();
  };

  const handleSettings = () => {
    navigate('/dashboard/settings');
    onClose();
  };

  const handleLogout = () => {
    // Logout logic
    onClose();
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
            onClick={() => {
              navigate('/dashboard/profile');
              onClose();
            }}
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
                  {user.username}
                </Text>
                <Text size="sm" className={styles.phoneText}>
                  {user.phone}
                </Text>
              </Box>
            </Flex>
          </Box>

          {/* Upgrade Plan */}
          <Box px="xs" pt="xs">
            <NavLink
              label="Upgrade plan"
              leftSection={<HiLightningBolt size={18} />}
              onClick={handleUpgrade}
              className={styles.navLink}
            />
          </Box>

          {/* Settings */}
          <Box px="xs">
            <NavLink
              label="Settings"
              leftSection={<FaCog size={18} />}
              onClick={handleSettings}
              className={styles.navLink}
            />
          </Box>

          {/* Log out */}
          <Box px="xs" pb="xs">
            <NavLink
              label="Log out"
              leftSection={<FaSignOutAlt size={18} />}
              onClick={handleLogout}
              className={styles.navLink}
            />
          </Box>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}

export default Drower;
