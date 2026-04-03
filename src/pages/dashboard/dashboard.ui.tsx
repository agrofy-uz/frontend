import { Title, Text, Stack } from '@mantine/core';
import { useAuthStore } from '@/shared/store/authStore';

function Dashboard() {
  const { user } = useAuthStore();

  const displayName = [
    user?.first_name,
    user?.last_name,
  ]
    .filter(Boolean)
    .join(' ')
    .trim();
  const usernamePart = user?.username ? ` (@${user.username})` : '';

  return (
    <Stack gap="md">
      <Title order={1}>Boshqaruv paneli</Title>
      <Text>
        Xush kelibsiz
        {displayName ? `, ${displayName}` : ''}
        {usernamePart}!
      </Text>
      <Text c="dimmed">
        Bu sizning boshqaruv panelingiz. Siz muvaffaqiyatli tizimga kirdingiz.
      </Text>
    </Stack>
  );
}

export default Dashboard;
