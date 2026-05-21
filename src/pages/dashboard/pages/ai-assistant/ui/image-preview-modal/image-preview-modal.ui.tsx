import { Modal } from '@mantine/core';
import styles from './image-preview-modal.module.css';

export type ImagePreviewModalProps = {
  imageUrl: string | null;
  onClose: () => void;
};

export function ImagePreviewModal({ imageUrl, onClose }: ImagePreviewModalProps) {
  return (
    <Modal
      opened={!!imageUrl}
      onClose={onClose}
      withCloseButton
      size="auto"
      padding={0}
      radius="md"
      centered
      styles={{
        content: { overflow: 'hidden' },
        body: { padding: 0 },
        header: { display: 'none' },
      }}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Katta ko'rinish"
          className={styles.image}
        />
      ) : null}
    </Modal>
  );
}
