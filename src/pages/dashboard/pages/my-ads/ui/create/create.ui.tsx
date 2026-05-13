import { useEffect, useState } from 'react';
import { Stack, Text } from '@mantine/core';
import { Segmented } from '@/shared/ui/segmented';
import { ServiceCreateForm } from './ui/service-create-form.ui';
import { Modal } from '@/shared/ui/modal';
import type { MyServiceDto } from '@/shared/api/services/my-ads';

type CreateProps = {
  opened: boolean;
  onClose: () => void;
  initialType: 'services' | 'products';
  editService?: MyServiceDto | null;
};

function Create({ opened, onClose, initialType, editService }: CreateProps) {
  const [createType, setCreateType] = useState<'services' | 'products'>(
    initialType
  );
  const isEditingService = Boolean(editService);

  useEffect(() => {
    if (!opened) return;
    setCreateType(isEditingService ? 'services' : initialType);
  }, [opened, initialType, isEditingService]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEditingService ? "E'lonni tahrirlash" : "Yangi e'lon yaratish"}
      radius="md"
    >
      <Stack gap="md">
        {!isEditingService ? (
          <Segmented
            fullWidth
            value={createType}
            onChange={(value) => setCreateType(value as 'services' | 'products')}
            data={[
              { label: 'Xizmat yaratish', value: 'services' },
              { label: 'Mahsulot yaratish', value: 'products' },
            ]}
          />
        ) : null}

        {createType === 'services' ? (
          <ServiceCreateForm
            opened={opened}
            mode={isEditingService ? 'edit' : 'create'}
            initialService={editService ?? null}
            onCancel={onClose}
          />
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
