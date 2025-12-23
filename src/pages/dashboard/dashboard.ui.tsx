import { Container, Title, Text, Stack } from '@mantine/core';
import { useAuthStore } from '@/shared/store/authStore';

function Dashboard() {
  const { user } = useAuthStore();

  return (
    <Container size="xl" py="xl">
      <Stack gap="md">
        <Title order={1}>Dashboard</Title>
        <Text>Welcome, {user?.name || user?.email || 'User'}!</Text>
        <Text c="dimmed">
          This is your dashboard. You are successfully authenticated.
        </Text>
      </Stack>
    </Container>
  );
}

export default Dashboard;
