import { Box, Group, SimpleGrid, Skeleton, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import s from '../card-detail.module.css';

export function CardDetailSkeleton() {
  const isMobile = useMediaQuery('(max-width: 48em)');

  return (
    <div className={s.layout} aria-busy="true" aria-label="Yuklanmoqda">
      <div>
        <Skeleton className={s.mainImage} radius={12} w="100%" />
        <SimpleGrid cols={4} spacing={8} mt={8}>
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} height={56} radius={10} />
          ))}
        </SimpleGrid>
      </div>

      <Stack gap={isMobile ? 8 : 10} h="100%">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Stack gap={8} style={{ flex: 1, minWidth: 0 }}>
            <Skeleton height={isMobile ? 22 : 26} width="85%" radius="sm" />
            <Skeleton height={isMobile ? 22 : 26} width="55%" radius="sm" />
          </Stack>
          <Skeleton height={24} width={72} radius="sm" />
        </Group>

        <Stack gap={6}>
          <Skeleton height={14} width="100%" radius="sm" />
          <Skeleton height={14} width="100%" radius="sm" />
          <Skeleton height={14} width="92%" radius="sm" />
          <Skeleton height={14} width="70%" radius="sm" />
        </Stack>

        <Skeleton height={16} width="65%" radius="sm" />
        <Skeleton height={16} width="50%" radius="sm" />
        <Skeleton height={16} width="75%" radius="sm" />

        <Stack gap={8}>
          <Skeleton height={18} width={140} radius="sm" />
          <Skeleton height={18} width={160} radius="sm" />
        </Stack>

        <Box className={s.divider} />

        <Group gap="md" align="center">
          <Group gap={6}>
            <Skeleton height={34} width={34} radius="md" />
            <Skeleton height={16} width={20} radius="sm" />
          </Group>
          <Skeleton height={24} width={100} radius="sm" />
          <Group gap={6}>
            <Skeleton height={34} width={34} radius="md" />
            <Skeleton height={16} width={20} radius="sm" />
          </Group>
        </Group>

        <Skeleton height={40} mt="auto" radius="md" />
      </Stack>
    </div>
  );
}
