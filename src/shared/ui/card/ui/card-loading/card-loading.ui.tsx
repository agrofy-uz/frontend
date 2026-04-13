import { Box, Skeleton } from '@mantine/core';

type CardLoadingProps = {
  actionMode?: 'contact' | 'manage';
};

function CardLoading({ actionMode = 'contact' }: CardLoadingProps) {
  return (
    <Box
      style={{
        width: '100%',
        maxWidth: '19rem',
        borderRadius: 'var(--mantine-radius-lg)',
        border: '1px solid light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-4))',
        overflow: 'hidden',
      }}
    >
      <Skeleton height={228} radius={0} />
      <Box p="sm">
        <Skeleton height={14} radius="sm" mb={8} />
        <Skeleton height={12} radius="sm" mb={6} />
        <Skeleton height={12} radius="sm" width="85%" mb={10} />
        <Skeleton height={14} radius="sm" width="40%" mb={10} />
        <Skeleton height={12} radius="sm" width="70%" mb={12} />
        {actionMode === 'manage' ? (
          <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Skeleton height={36} radius="md" />
            <Skeleton height={36} radius="md" />
          </Box>
        ) : (
          <Skeleton height={36} radius="md" />
        )}
      </Box>
    </Box>
  );
}

export default CardLoading;
