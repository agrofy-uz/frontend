import { Alert, Button, Group, Stack, Text } from '@mantine/core';
import { MdOutlineWarningAmber } from 'react-icons/md';
import { Modal } from '@/shared/ui/modal';

type ConfirmationProps = {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  title?: string;
};

export function Confirmation({
  opened,
  onClose,
  onConfirm,
  loading = false,
  title,
}: ConfirmationProps) {
  return (
    <Modal
      opened={opened}
      onClose={loading ? () => {} : onClose}
      title="E'lonni o‘chirish"
      centered
      size="sm"
      radius="md"
      closeOnClickOutside={!loading}
      closeOnEscape={!loading}
    >
      <Stack gap="sm">
        <Alert
          variant="light"
          color="red"
          radius="md"
          icon={<MdOutlineWarningAmber size={18} />}
        >
          Bu amalni bekor qilib bo‘lmaydi.
        </Alert>

        <Text size="sm" c="dimmed" lh={1.5}>
          E'lonni o‘chirsangiz, uni keyinroq qayta tiklab bo‘lmaydi.
        </Text>

        {title?.trim() ? (
          <Text size="sm" fw={600} lineClamp={2}>
            «{title.trim()}»
          </Text>
        ) : null}

        <Group justify="flex-end" gap="xs" mt="xs">
          <Button variant="default" onClick={onClose} disabled={loading}>
            Bekor qilish
          </Button>
          <Button color="red" onClick={onConfirm} loading={loading}>
            O‘chirish
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}
