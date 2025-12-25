import { Title, Text, Stack } from '@mantine/core';
import { useAuthStore } from '@/shared/store/authStore';

function Dashboard() {
  const { user } = useAuthStore();

  return (
    <Stack gap="md">
      <Title order={1}>Dashboard</Title>
      <Text>
        Welcome, {user?.first_name}!{user?.last_name && ` ${user?.last_name}`}
        {user?.username && ` @${user?.username}`}
      </Text>
      <Text c="dimmed">
        This is your dashboard. You are successfully authenticated.
      </Text>
    </Stack>
  );
}

export default Dashboard;
