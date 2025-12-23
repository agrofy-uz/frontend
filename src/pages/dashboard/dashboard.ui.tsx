import { Container, Title, Text, Stack, Button } from '@mantine/core';
import { useAuthStore } from '@/shared/store/authStore';
import { useNavigate } from 'react-router-dom';
import { openNotification } from '@/shared/lib/notification';
import { FaSignOutAlt } from 'react-icons/fa';

function Dashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();

    openNotification({
      title: 'Tizimdan chiqildi',
      type: 'error',
      icon: <FaSignOutAlt size={24} />,
    });

    navigate('/');
  };

  return (
    <Container size="xl" py="xl">
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
      <Button onClick={handleLogout}>Logout</Button>
    </Container>
  );
}

export default Dashboard;
