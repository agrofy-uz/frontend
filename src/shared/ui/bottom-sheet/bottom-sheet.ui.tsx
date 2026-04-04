import { Box, Drawer, Stack } from '@mantine/core';
import type { ReactNode } from 'react';

export type BottomSheetProps = {
  opened: boolean;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  /** Mantine `size` (asosan token); balandlik asosan kontent bo‘yicha */
  size?: string | number;
  withCloseButton?: boolean;
};

const HANDLE_H = 4;
const HANDLE_PAD_TOP = 10;
const HANDLE_PAD_BOTTOM = 8;

export function BottomSheet({
  opened,
  onClose,
  children,
  footer,
  size = 'md',
  withCloseButton = false,
}: BottomSheetProps) {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="bottom"
      size={size}
      radius="lg"
      padding={0}
      offset={0}
      withOverlay
      overlayProps={{ backgroundOpacity: 0.5, blur: 6 }}
      withCloseButton={withCloseButton}
      closeButtonProps={{ 'aria-label': 'Yopish' }}
      styles={{
        inner: {
          padding: 0,
          alignItems: 'flex-end',
        },
        content: {
          width: '100%',
          maxWidth: '100%',
          height: 'fit-content',
          maxHeight: '92dvh',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          overflow: 'hidden',
          boxShadow: '0 -10px 30px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
        },
        header: {
          padding: 0,
        },
        body: {
          flex: 1,
          minHeight: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Stack
        gap={0}
        style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}
      >
        {/* Yuqori markazda chiziqcha (bottom sheet affordance) */}
        <Box
          pt={HANDLE_PAD_TOP}
          pb={HANDLE_PAD_BOTTOM}
          style={{ flexShrink: 0 }}
        >
          <Box
            mx="auto"
            w={40}
            h={HANDLE_H}
            bg="var(--mantine-color-gray-4)"
            style={{ borderRadius: 10, opacity: 0.85 }}
            aria-hidden
          />
        </Box>

        <Box
          px="lg"
          style={{
            flex: '1 1 auto',
            minHeight: 0,
            overflowY: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {children}
        </Box>

        {footer ? (
          <Box
            px="lg"
            py="md"
            style={{
              flexShrink: 0,
              borderTop: '1px solid var(--mantine-color-default-border)',
              background: 'var(--mantine-color-body)',
              paddingBottom:
                'calc(var(--mantine-spacing-md) + env(safe-area-inset-bottom, 0px))',
            }}
          >
            {footer}
          </Box>
        ) : null}
      </Stack>
    </Drawer>
  );
}
