import { Group, Rating as MantineRating, Stack, Text } from '@mantine/core';
import type { MantineSize } from '@mantine/core';

export interface RatingProps {
  label?: string;
  description?: string;
  value: number;
  onChange: (value: number) => void;
  count?: number;
  size?: MantineSize | number;
}

export interface RatingValueDisplayProps {
  value: number;
  size?: MantineSize | number;
}

export function Rating({
  label,
  description = '0 — cheklov yo‘q',
  value,
  onChange,
  count = 5,
  size = 'lg',
}: RatingProps) {
  return (
    <Stack gap="xs">
      {label ? (
        <Text size="sm" fw={500}>
          {label}
        </Text>
      ) : null}
      {description ? (
        <Text size="xs" c="dimmed">
          {description}
        </Text>
      ) : null}
      <MantineRating
        value={value}
        onChange={onChange}
        count={count}
        color="yellow"
        size={size}
      />
    </Stack>
  );
}

export function RatingValueDisplay({
  value,
  size = 'sm',
}: RatingValueDisplayProps) {
  const normalized = Math.max(0, Math.min(5, value));

  return (
    <Group gap={6} wrap="nowrap" ta="end">
      <MantineRating
        value={normalized}
        readOnly
        fractions={10}
        color="yellow"
        size={size}
      />
      <Text size="xs" c="dimmed">
        ({normalized.toFixed(1)})
      </Text>
    </Group>
  );
}
