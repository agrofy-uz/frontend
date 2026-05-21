import { ActionIcon, Box, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IoClose } from 'react-icons/io5';
import { Modal } from '@/shared/ui/modal';
import { CreateForm } from './ui/create-form.ui';
import type { MyProductDto, MyServiceDto } from '@/shared/api/services/my-ads';
import { MY_ADS_MOBILE_MQ } from '../../my-ads.const';
import styles from './create.module.css';

export type MyAdsEditDraft = {
  kind: 'services' | 'products';
  item: MyServiceDto | MyProductDto;
};

type CreateProps = {
  opened: boolean;
  onClose: () => void;
  initialType: 'services' | 'products';
  editDraft: MyAdsEditDraft | null;
};

function Create({ opened, onClose, initialType, editDraft }: CreateProps) {
  const isMobile = useMediaQuery(MY_ADS_MOBILE_MQ, false, {
    getInitialValueInEffect: true,
  });

  const isEditingListing = Boolean(editDraft);
  const listingKind = editDraft?.kind ?? initialType;

  const title = isEditingListing
    ? "E'lonni tahrirlash"
    : listingKind === 'services'
      ? 'Xizmat yaratish'
      : 'Mahsulot yaratish';

  const formProps = {
    opened,
    mode: (isEditingListing ? 'edit' : 'create') as 'edit' | 'create',
    initialService: editDraft?.item ?? null,
    listingKind,
    onCancel: onClose,
  };

  const mobileShell = (
    <Box className={styles.shellInner}>
      <Box className={styles.header}>
        <Text className={styles.headerTitle} lineClamp={1}>
          {title}
        </Text>
        <ActionIcon
          className={styles.headerClose}
          variant="subtle"
          color="gray"
          size="lg"
          radius="md"
          aria-label="Yopish"
          onClick={onClose}
        >
          <IoClose size={24} />
        </ActionIcon>
      </Box>
      <CreateForm presentation="fullscreen" {...formProps} />
    </Box>
  );

  if (isMobile) {
    return (
      <Modal
        opened={opened}
        onClose={onClose}
        fullScreen
        padding={0}
        withCloseButton={false}
        transitionProps={{ transition: 'fade', duration: 200 }}
        styles={{
          inner: { padding: 0, alignItems: 'stretch' },
          content: {
            height: '100%',
            maxHeight: '100dvh',
            borderRadius: 0,
          },
          body: { padding: 0, height: '100%', overflow: 'hidden' },
          header: { display: 'none' },
        }}
      >
        {mobileShell}
      </Modal>
    );
  }

  return (
    <Modal opened={opened} onClose={onClose} title={title} radius="md" centered>
      <CreateForm presentation="modal" {...formProps} />
    </Modal>
  );
}

export default Create;
