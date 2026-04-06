import { Stack, Text, ThemeIcon } from '@mantine/core';
import { GrServices } from 'react-icons/gr';
import { Button } from '@/shared/ui/button';

export function RegularEmpty() {
  return (
    <Stack align="center" justify="center" py="xl">
      <ThemeIcon size={64} radius="xl" variant="light">
        <GrServices size={36} />
      </ThemeIcon>

      <Text fw={600} size="lg">
        Xizmatlar topilmadi
      </Text>

      <Text size="sm" c="dimmed" ta="center" maw={260}>
        Hozircha oddiy xizmatlar mavjud emas. Keyinroq yana tekshirib ko‘ring.
      </Text>
      <Button>O'z xizmatlaringizni qo'shish</Button>
    </Stack>
  );
}
