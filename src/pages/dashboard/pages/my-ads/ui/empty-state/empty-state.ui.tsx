import { Stack, Text } from '@mantine/core';
import { MdOutlinePostAdd } from 'react-icons/md';
import { Button } from '@/shared/ui/button';
import { useMediaQuery } from '@mantine/hooks';
import { MY_ADS_MOBILE_MQ } from '../../my-ads.const';

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
};

function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const isMobile = useMediaQuery(MY_ADS_MOBILE_MQ);
  return (
    <Stack
      align="center"
      justify="center"
      gap="sm"
      mt={isMobile ? '100px' : '220px'}
      py="xl"
      mih={260}
      ta="center"
    >
      <MdOutlinePostAdd size={48} color="var(--mantine-color-gray-6)" />
      <Text fw={600} size="lg">
        {title}
      </Text>
      <Text c="dimmed" maw={420}>
        {description}
      </Text>
      <Button
        type="button"
        mt="xs"
        h={isMobile ? 34 : 36}
        onClick={(e) => {
          e.preventDefault();
          onAction();
        }}
      >
        {actionLabel}
      </Button>
    </Stack>
  );
}

export default EmptyState;
