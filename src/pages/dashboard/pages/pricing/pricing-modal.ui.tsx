import { Box, ActionIcon } from '@mantine/core';
import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';
import { PricingView } from './pricing.ui';

export type PricingModalProps = {
  opened: boolean;
  onClose: () => void;
};

export function PricingModal({ opened, onClose }: PricingModalProps) {
  if (!opened || typeof document === 'undefined') return null;

  return createPortal(
    <Box
      pos="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      mih="100dvh"
      miw="100%"
      bg="var(--mantine-color-body)"
      style={{ zIndex: 500 }}
    >
      <ActionIcon
        variant="subtle"
        color="gray"
        size="lg"
        radius="md"
        aria-label="Yopish"
        pos="absolute"
        top={12}
        right={12}
        onClick={onClose}
      >
        <IoClose size={26} />
      </ActionIcon>
      <Box
        p="xl"
        pt={56}
        style={{
          height: '100%',
          overflow: 'auto',
          boxSizing: 'border-box',
        }}
      >
        <PricingView />
      </Box>
    </Box>,
    document.body
  );
}
