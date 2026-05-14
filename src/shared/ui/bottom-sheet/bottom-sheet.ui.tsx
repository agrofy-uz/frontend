import { Box, Drawer, Stack, VisuallyHidden } from '@mantine/core';
import { useRef, type ReactNode } from 'react';

export type BottomSheetProps = {
  opened: boolean;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  /** Mantine `Drawer` `size` (pastdan ochilganda balandlik) */
  size?: string | number;
  withCloseButton?: boolean;
  /** Overlay va boshqa drawerlar ustida */
  zIndex?: number;
  /** Ekran o‘qituvchilari uchun yashirin sarlavha */
  hiddenTitle?: string;
  /** Tutqich zonasidan pastga surilganda yopish */
  closeOnSwipeDown?: boolean;
};

const HANDLE_H = 4;
const HANDLE_PAD_TOP = 10;
const HANDLE_PAD_BOTTOM = 8;
const SWIPE_DOWN_CLOSE_PX = 64;

export function BottomSheet({
  opened,
  onClose,
  children,
  footer,
  size = '96%',
  withCloseButton = false,
  zIndex,
  hiddenTitle,
  closeOnSwipeDown = true,
}: BottomSheetProps) {
  const swipeY0 = useRef<number | null>(null);

  const onHandleTouchStart = (e: React.TouchEvent) => {
    if (!closeOnSwipeDown) return;
    swipeY0.current = e.touches[0].clientY;
  };

  const onHandleTouchEnd = (e: React.TouchEvent) => {
    if (!closeOnSwipeDown || swipeY0.current == null) return;
    const dy = e.changedTouches[0].clientY - swipeY0.current;
    swipeY0.current = null;
    if (dy > SWIPE_DOWN_CLOSE_PX) {
      onClose();
    }
  };

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
      {...(withCloseButton
        ? { closeButtonProps: { 'aria-label': 'Yopish' } as const }
        : {})}
      closeOnClickOutside
      zIndex={zIndex}
      transitionProps={{ transition: 'slide-up', duration: 240 }}
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
          ...(withCloseButton ? {} : { display: 'none' }),
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
        {hiddenTitle ? <VisuallyHidden>{hiddenTitle}</VisuallyHidden> : null}

        <Box
          role="presentation"
          pt={HANDLE_PAD_TOP}
          pb={HANDLE_PAD_BOTTOM}
          style={{ flexShrink: 0 }}
          onTouchStart={onHandleTouchStart}
          onTouchEnd={onHandleTouchEnd}
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
            paddingBottom: footer
              ? undefined
              : 'calc(var(--mantine-spacing-lg) + env(safe-area-inset-bottom, 0px))',
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
