import { Box, SimpleGrid, Skeleton, Stack } from '@mantine/core';
import { MAX_IMAGES } from '../service-create-form.const';

function FieldSkeleton({ inputHeight = 36 }: { inputHeight?: number }) {
  return (
    <Stack gap={6}>
      <Skeleton height={12} width={96} radius="sm" />
      <Skeleton height={inputHeight} radius="md" />
    </Stack>
  );
}

/** Tahrirlashda e'lon tafsiloti yuklanayotganda forma o‘rniga */
export function ServiceCreateFormSkeleton() {
  return (
    <Stack gap="sm" aria-busy="true" aria-label="E'lon ma'lumotlari yuklanmoqda">
      <FieldSkeleton />

      <FieldSkeleton />

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
        <FieldSkeleton />
        <FieldSkeleton />
      </SimpleGrid>

      <FieldSkeleton inputHeight={44} />

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
        <FieldSkeleton />
        <FieldSkeleton />
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm">
        <FieldSkeleton />
        <FieldSkeleton />
      </SimpleGrid>

      <Stack gap={6}>
        <Skeleton height={12} width={72} radius="sm" />
        <Skeleton height={88} radius="md" />
      </Stack>

      <Stack gap={6}>
        <Skeleton height={12} width={56} radius="sm" />
        <SimpleGrid cols={3} spacing="sm">
          {Array.from({ length: MAX_IMAGES }, (_, i) => (
            <Box key={i} h={110}>
              <Skeleton height={110} radius={10} />
            </Box>
          ))}
        </SimpleGrid>
      </Stack>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm" mt="sm">
        <Skeleton height={36} radius="md" />
        <Skeleton height={36} radius="md" />
      </SimpleGrid>
    </Stack>
  );
}
