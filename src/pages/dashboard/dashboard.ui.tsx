import { Box, Center, Stack, Text, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { useAuthStore } from '@/shared/store/authStore';

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const firstName = user?.first_name?.trim();
  const displayName = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(' ')
    .trim();
  const nameForGreeting = firstName || displayName || '';

  return (
    <Box
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'min(72dvh, calc(100dvh - 7rem))',
      }}
    >
      <Center px="md" w="100%">
        <Stack align="center" gap="lg" maw={520} ta="center">
          <Title order={2} className="textPrimary">
            Assalomu alaykum{nameForGreeting ? `, ${nameForGreeting}` : ''}!
          </Title>
          <Text c="dimmed" size="md">
            Bu bo‘lim tez orada faoliyatini boshlaydi. Hozir esa AI yordamchini
            sinab ko‘rishingiz mumkin.
          </Text>
          <Button size="md" onClick={() => navigate('/dashboard/ai')}>
            AI yordamchini sinab ko‘rish
          </Button>
        </Stack>
      </Center>
    </Box>
  );
}

export default Dashboard;
