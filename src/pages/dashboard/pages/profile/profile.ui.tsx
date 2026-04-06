import { Avatar, Box, Stack, Text, Title } from '@mantine/core';
import { useAuthStore } from '@/shared/store/authStore';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function Profile() {
  const { user } = useAuthStore();
  const displayName =
    [user?.first_name, user?.last_name].filter(Boolean).join(' ').trim() ||
    'Foydalanuvchi';
  const photo = user?.photo_url || null;

  return (
    <Box>
      <Title order={2}>Profil</Title>
      <Stack gap="md" mt="lg" align="flex-start">
        <Avatar src={photo ?? undefined} size={96} radius="md">
          {getInitials(displayName)}
        </Avatar>
        <div>
          <Text fw={600} size="lg">
            {displayName}
          </Text>
          {user?.username ? (
            <Text c="dimmed" size="sm">
              @{user.username}
            </Text>
          ) : null}
          {user?.phone_number ? (
            <Text c="dimmed" size="sm" mt={4}>
              {user.phone_number}
            </Text>
          ) : null}
        </div>
        <Text c="dimmed" size="sm">
          Boshqa profil sozlamalari — tez orada.
        </Text>
      </Stack>
    </Box>
  );
}

export default Profile;
