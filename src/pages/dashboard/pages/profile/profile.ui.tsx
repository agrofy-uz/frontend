import { useEffect } from 'react';
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Group,
  Paper,
  Skeleton,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { MdOutlineEdit } from 'react-icons/md';
import { getAuthMe, mapAuthMeToUser } from '@/shared/api';
import { formatDate } from '@/shared/lib/dateHelper';
import { useAuthStore, useAuthStoreHydrated } from '@/shared/store/authStore';
import { formatPhoneNumber } from '@/shared/lib/formatNumber';
import { ProfileEditModal } from './ui';

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  const letters = parts.map((n) => n[0]).join('');
  return letters.toUpperCase().slice(0, 2);
}

function ProfileField({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  if (value === null || value === undefined || value === '') return null;
  return (
    <Group justify="space-between" align="flex-start" wrap="nowrap" gap="md">
      <Text c="dimmed" size="sm" maw="42%">
        {label}
      </Text>
      <Text size="sm" ta="right" style={{ wordBreak: 'break-word' }}>
        {value}
      </Text>
    </Group>
  );
}

function Profile() {
  const hydrated = useAuthStoreHydrated();
  const { user, accessToken, isAuthenticated, updateUser } = useAuthStore();
  const [editOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);

  const meQuery = useQuery({
    queryKey: ['auth', 'me', accessToken],
    queryFn: async () => {
      const me = await getAuthMe();
      return mapAuthMeToUser(me);
    },
    enabled: hydrated && isAuthenticated && Boolean(accessToken),
    staleTime: 60_000,
    refetchOnMount: 'always',
  });

  useEffect(() => {
    if (meQuery.data) {
      updateUser(meQuery.data);
    }
  }, [meQuery.data, updateUser]);

  const profile = meQuery.data ?? user;
  const displayName =
    [profile?.first_name, profile?.last_name]
      .filter(Boolean)
      .join(' ')
      .trim() || 'Foydalanuvchi';
  const photo = profile?.photo_url || null;

  const premiumLabel =
    profile?.premium_plan_tier_label_uz?.trim() ||
    profile?.premium_plan_tier?.trim() ||
    null;

  const showSkeleton =
    !hydrated || (meQuery.isPending && !profile && Boolean(accessToken));

  if (showSkeleton) {
    return (
      <>
        <Box>
          <Stack gap="md" mt="lg">
            <Group align="flex-start" wrap="wrap">
              <Skeleton height={96} width={96} radius="md" />
              <Stack gap="xs" flex={1} maw={360}>
                <Skeleton height={22} width="60%" />
                <Skeleton height={16} width="40%" />
                <Skeleton height={16} width="70%" />
              </Stack>
            </Group>
            <Skeleton height={120} radius="md" />
          </Stack>
        </Box>
        <ProfileEditModal opened={editOpened} onClose={closeEdit} />
      </>
    );
  }

  if (!isAuthenticated || !accessToken) {
    return (
      <Box>
        <Text c="dimmed" mt="md">
          Profilni ko‘rish uchun tizimga kiring.
        </Text>
      </Box>
    );
  }

  return (
    <>
      <Box>
        {!profile && meQuery.isError ? null : (
          <Stack gap="lg" mt="lg" align="stretch" maw={520}>
            <Paper withBorder p="lg" radius="md" shadow="xs">
              <Group
                justify="space-between"
                align="flex-start"
                wrap="nowrap"
                gap="md"
              >
                <Group
                  align="flex-start"
                  wrap="wrap"
                  gap="lg"
                  style={{ flex: 1, minWidth: 0 }}
                >
                  <Avatar src={photo ?? undefined} size={96} radius="md">
                    {getInitials(displayName)}
                  </Avatar>
                  <Stack gap={4} flex={1} miw={200}>
                    <Text fw={600} size="lg">
                      {displayName}
                    </Text>
                    {profile?.username ? (
                      <Text c="dimmed" size="sm">
                        @{profile.username}
                      </Text>
                    ) : null}
                    {profile?.phone_number ? (
                      <Text c="dimmed" size="sm">
                        {formatPhoneNumber(profile.phone_number)}
                      </Text>
                    ) : null}
                  </Stack>
                </Group>
                {user ? (
                  <Tooltip label="Profilni tahrirlash" position="left">
                    <ActionIcon
                      variant="light"
                      color="gray"
                      size="lg"
                      radius="md"
                      aria-label="Profilni tahrirlash"
                      onClick={openEdit}
                    >
                      <MdOutlineEdit size={20} />
                    </ActionIcon>
                  </Tooltip>
                ) : null}
              </Group>
            </Paper>

            <Paper withBorder p="lg" radius="md">
              <Text fw={600} size="sm" mb="sm" tt="uppercase" c="dimmed">
                Hisob
              </Text>
              <Stack gap="sm">
                <ProfileField
                  label="Telegram ID"
                  value={
                    profile?.telegram_id ? String(profile.telegram_id) : null
                  }
                />
                <ProfileField
                  label="Ro‘yxatdan o‘tgan"
                  value={
                    profile?.created_at ? formatDate(profile.created_at) : null
                  }
                />
              </Stack>
            </Paper>

            <Paper withBorder p="lg" radius="md">
              <Group justify="space-between" mb="sm" wrap="wrap">
                <Text fw={600} size="sm" tt="uppercase" c="dimmed">
                  Premium
                </Text>
                {profile?.premium ? (
                  <Badge color="yellow" variant="light">
                    Faol
                  </Badge>
                ) : (
                  <Badge variant="light" color="gray">
                    Yo‘q
                  </Badge>
                )}
              </Group>
              <Stack gap="sm">
                {profile?.premium ? (
                  <>
                    <ProfileField label="Tarif" value={premiumLabel} />
                    <ProfileField
                      label="Muddati"
                      value={
                        profile.premium_expires_at
                          ? formatDate(profile.premium_expires_at)
                          : null
                      }
                    />
                    {profile.premium_plan_months != null ? (
                      <ProfileField
                        label="Oy"
                        value={String(profile.premium_plan_months)}
                      />
                    ) : null}
                  </>
                ) : (
                  <Text size="sm" c="dimmed">
                    Premium imkoniyatlarini Pricing bo‘limidan ulashingiz
                    mumkin.
                  </Text>
                )}
              </Stack>
            </Paper>
          </Stack>
        )}
      </Box>
      <ProfileEditModal opened={editOpened} onClose={closeEdit} />
    </>
  );
}

export default Profile;
