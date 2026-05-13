import { useEffect, useState } from 'react';
import { Stack } from '@mantine/core';
import { Segmented } from '@/shared/ui/segmented';
import { ServiceCreateForm } from './ui/service-create-form.ui';
import { Modal } from '@/shared/ui/modal';
import type { MyServiceDto } from '@/shared/api/services/my-ads';

export type MyAdsEditDraft = {
  kind: 'services' | 'products';
  item: MyServiceDto;
};

type CreateProps = {
  opened: boolean;
  onClose: () => void;
  initialType: 'services' | 'products';
  editDraft: MyAdsEditDraft | null;
};

function Create({ opened, onClose, initialType, editDraft }: CreateProps) {
  const [createType, setCreateType] = useState<'services' | 'products'>(
    initialType,
  );
  const isEditingListing = Boolean(editDraft);

  useEffect(() => {
    if (!opened) return;
    setCreateType(editDraft !== null ? editDraft.kind : initialType);
  }, [opened, initialType, editDraft]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEditingListing ? "E'lonni tahrirlash" : "Yangi e'lon yaratish"}
      radius="md"
    >
      <Stack gap="md">
        {!isEditingListing ? (
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

        <ServiceCreateForm
          opened={opened}
          mode={isEditingListing ? 'edit' : 'create'}
          initialService={editDraft?.item ?? null}
          listingKind={createType}
          onCancel={onClose}
        />
      </Stack>
    </Modal>
  );
}

export default Create;
