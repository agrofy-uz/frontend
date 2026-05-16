import { Box, ActionIcon } from '@mantine/core';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { IoClose } from 'react-icons/io5';
import { PricingView } from './pricing.ui';

export type PricingModalProps = {
  opened: boolean;
  onClose: () => void;
};

export function PricingModal({ opened, onClose }: PricingModalProps) {
  useEffect(() => {
    if (!opened) return undefined;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [opened]);

  if (!opened || typeof document === 'undefined') return null;

  return createPortal(
    <Box
      pos="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      h="100dvh"
      w="100%"
      bg="var(--mantine-color-body)"
      style={{
        zIndex: 1100,
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
        style={{
          flex: '1 1 auto',
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          WebkitOverflowScrolling: 'touch',
          overscrollBehavior: 'contain',
          boxSizing: 'border-box',
        }}
        px="xl"
        pb="calc(var(--mantine-spacing-xl) + env(safe-area-inset-bottom, 0px))"
      >
        <PricingView />
      </Box>
    </Box>,
    document.body
  );
}
