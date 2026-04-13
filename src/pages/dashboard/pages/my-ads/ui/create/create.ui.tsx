import { useEffect, useState } from 'react';
import { Stack, Text } from '@mantine/core';
import { Segmented } from '@/shared/ui/segmented';
import { ServiceCreateForm } from './ui/service-create-form.ui';
import { Modal } from '@/shared/ui/modal';

type CreateProps = {
  opened: boolean;
  onClose: () => void;
  initialType: 'services' | 'products';
};

function Create({ opened, onClose, initialType }: CreateProps) {
  const [createType, setCreateType] = useState<'services' | 'products'>(
    initialType
  );
  useEffect(() => {
    if (!opened) return;
    setCreateType(initialType);
  }, [opened, initialType]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Yangi e'lon yaratish"
      radius="md"
    >
      <Stack gap="md">
        <Segmented
          fullWidth
          value={createType}
          onChange={(value) => setCreateType(value as 'services' | 'products')}
          data={[
            { label: 'Xizmat yaratish', value: 'services' },
            { label: 'Mahsulot yaratish', value: 'products' },
          ]}
        />

        {createType === 'services' ? (
          <ServiceCreateForm onCancel={onClose} />
        ) : (
          <Text c="dimmed">
            Mahsulot yaratish formasi keyingi bosqichda qo‘shiladi.
          </Text>
        )}
      </Stack>
    </Modal>
  );
}

export default Create;
