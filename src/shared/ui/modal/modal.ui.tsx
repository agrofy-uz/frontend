import {
  Modal as MantineModal,
  type ModalProps as MantineModalProps,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useEffect } from 'react';

type AppModalProps = MantineModalProps;

function Modal({
  opened,
  centered = false,
  size,
  yOffset,
  radius = 'md',
  fullScreen = false,
  closeOnClickOutside = true,
  styles,
  onClose,
  overlayProps,
  ...props
}: AppModalProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const defaultYOffset = yOffset ?? (isMobile ? 8 : '10vh');

  useEffect(() => {
    if (!opened || !closeOnClickOutside) return undefined;

    const onMouseDown = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;

      const clickedInner = target.closest('.app-modal-inner');
      const clickedContent = target.closest('.app-modal-content');

      if (clickedInner && !clickedContent) {
        onClose?.();
      }
    };

    document.addEventListener('mousedown', onMouseDown, true);
    return () => document.removeEventListener('mousedown', onMouseDown, true);
  }, [opened, closeOnClickOutside, onClose]);

  return (
    <MantineModal
      opened={opened}
      centered={centered}
      fullScreen={fullScreen}
      closeOnClickOutside={closeOnClickOutside}
      onClose={onClose}
      overlayProps={{
        ...overlayProps,
        onClick: (event) => {
          overlayProps?.onClick?.(event);
          if (closeOnClickOutside) onClose?.();
        },
      }}
      size={size ?? (isMobile ? 'calc(100vw - 1rem)' : 'min(92vw, 760px)')}
      yOffset={defaultYOffset}
      radius={radius}
      classNames={{
        inner: 'app-modal-inner',
        content: 'app-modal-content',
      }}
      styles={{
        inner: {
          alignItems: 'flex-start',
          height: '100dvh',
          maxHeight: '100dvh',
          paddingTop: defaultYOffset,
          paddingBottom: 12,
          overflowY: 'auto',
          scrollbarGutter: 'stable',
          pointerEvents: 'auto',
        },
        content: {
          maxHeight: 'none',
        },
        body: {
          maxHeight: 'none',
          overflowY: 'visible',
        },
        ...(typeof styles === 'object' && styles ? styles : {}),
      }}
      {...props}
    />
  );
}

export default Modal;
