import { Button, Group, Modal, Stack, Text } from '@mantine/core';

export type DeleteChatConfirmationModalProps = {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  chatTitle?: string;
  loading?: boolean;
};

export function DeleteChatConfirmationModal({
  opened,
  onClose,
  onConfirm,
  chatTitle,
  loading = false,
}: DeleteChatConfirmationModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={loading ? () => {} : onClose}
      title="Chatni o‘chirish"
      centered
      closeOnClickOutside={!loading}
      closeOnEscape={!loading}
    >
      <Stack gap="md">
        <Text size="sm" c="dimmed">
          Bu chatni o‘chirsangiz, suhbat va uning mazmuni butunlay yo‘qoladi.
          Keyinroq qayta tiklab bo‘lmaydi.
        </Text>
        {chatTitle?.trim() ? (
          <Text size="sm" fw={500} lineClamp={2}>
            «{chatTitle.trim()}»
          </Text>
        ) : null}
        <Group justify="flex-end" gap="sm" mt="xs">
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
