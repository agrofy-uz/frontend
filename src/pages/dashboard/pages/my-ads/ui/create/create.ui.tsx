import { useEffect, useState } from 'react';
import { Modal, Stack, Text } from '@mantine/core';
import { Segmented } from '@/shared/ui/segmented';
import { useMediaQuery } from '@mantine/hooks';

type CreateProps = {
  opened: boolean;
  onClose: () => void;
  initialType: 'services' | 'products';
};

function Create({ opened, onClose, initialType }: CreateProps) {
  const [createType, setCreateType] = useState<'services' | 'products'>(
    initialType
  );
  const isMobile = useMediaQuery('(max-width: 768px)');
  useEffect(() => {
    if (!opened) return;
    setCreateType(initialType);
  }, [opened, initialType]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Yangi e'lon yaratish"
      size={isMobile ? '100%' : '60%'}
      yOffset={isMobile ? 100 : '15vh'}
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

        <Text c="dimmed">
          {createType === 'services'
            ? 'Xizmat yaratish formasi shu yerga qo‘yiladi.'
            : 'Mahsulot yaratish formasi shu yerga qo‘yiladi.'}
        </Text>
      </Stack>
    </Modal>
  );
}

export default Create;
