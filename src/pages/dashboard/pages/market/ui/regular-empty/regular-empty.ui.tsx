import { Stack, Text, ThemeIcon } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { FaStore } from 'react-icons/fa6';
import { Button } from '@/shared/ui/button';

type MarketRegularEmptyProps = {
  hint?: string;
};

export function MarketRegularEmpty({ hint }: MarketRegularEmptyProps) {
  const navigate = useNavigate();

  return (
    <Stack align="center" justify="center" py="xl">
      <ThemeIcon size={64} radius="xl" variant="light">
        <FaStore size={36} />
      </ThemeIcon>

      <Text fw={600} size="lg">
        Mahsulotlar topilmadi
      </Text>

      <Text size="sm" c="dimmed" ta="center" maw={260}>
        {hint ??
          'Hozircha mahsulotlar mavjud emas. Keyinroq yana tekshirib ko\'ring.'}
      </Text>
      <Button onClick={() => navigate('/dashboard/my-ads?create=products')}>
        O'z mahsulotlaringizni qo'shish
      </Button>
    </Stack>
  );
}
