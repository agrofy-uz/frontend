import { Stack, Text, ThemeIcon } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import { GrServices } from 'react-icons/gr';
import { Button } from '@/shared/ui/button';

type RegularEmptyProps = {
  hint?: string;
};

export function RegularEmpty({ hint }: RegularEmptyProps) {
  const navigate = useNavigate();

  return (
    <Stack align="center" justify="center" py="xl">
      <ThemeIcon size={64} radius="xl" variant="light">
        <GrServices size={36} />
      </ThemeIcon>

      <Text fw={600} size="lg">
        Xizmatlar topilmadi
      </Text>

      <Text size="sm" c="dimmed" ta="center" maw={260}>
        {hint ??
          'Hozircha oddiy xizmatlar mavjud emas. Keyinroq yana tekshirib ko‘ring.'}
      </Text>
      <Button
        onClick={() => navigate('/dashboard/my-ads?create=services')}
      >
        O‘z xizmatlaringizni qo‘shish
      </Button>
    </Stack>
  );
}
