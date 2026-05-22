import { Box, ActionIcon } from '@mantine/core';
import { IoClose } from 'react-icons/io5';
import { Modal } from '@/shared/ui/modal';
import { PricingView } from './pricing.ui';
import styles from './pricing.module.css';

export type PricingModalProps = {
  opened: boolean;
  onClose: () => void;
};

export function PricingModal({ opened, onClose }: PricingModalProps) {
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
      <Box
        h="100%"
        w="100%"
        bg="var(--mantine-color-body)"
        style={{
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Box
          component="header"
          pos="relative"
          style={{ flexShrink: 0, zIndex: 1 }}
          pt="calc(12px + env(safe-area-inset-top, 0px))"
          pr="calc(12px + env(safe-area-inset-right, 0px))"
          pb={4}
          pl="calc(12px + env(safe-area-inset-left, 0px))"
        >
          <ActionIcon
            variant="subtle"
            color="gray"
            size="lg"
            radius="md"
            aria-label="Yopish"
            ml="auto"
            display="flex"
            onClick={onClose}
          >
            <IoClose size={26} />
          </ActionIcon>
        </Box>
        <Box
          component="main"
          className={styles.scrollMain}
          px="xl"
          pt="xs"
          pb="calc(var(--mantine-spacing-xl) + env(safe-area-inset-bottom, 0px))"
        >
          <PricingView />
        </Box>
      </Box>
    </Modal>
  );
}
