import { Popover, Stack, Text, Box } from '@mantine/core';
import { useRef } from 'react';
import { MdPhotoCamera, MdPhotoLibrary } from 'react-icons/md';
import styles from './attach-menu.module.css';

interface AttachMenuProps {
  opened: boolean;
  onOpenChange: (opened: boolean) => void;
  children: React.ReactNode;
  onFilesSelected: (files: File[]) => void;
}

const ACCEPT_IMAGES = 'image/*';
const ACCEPT_ALL = 'image/*,.pdf,.doc,.docx';

export function AttachMenu({
  opened,
  onOpenChange,
  children,
  onFilesSelected,
}: AttachMenuProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFilesSelected(Array.from(files));
      e.target.value = '';
      onOpenChange(false);
    }
  };

  return (
    <Popover
      position="top"
      withArrow
      shadow="lg"
      radius="lg"
      opened={opened}
      onChange={onOpenChange}
    >
      <Popover.Target>{children}</Popover.Target>

      <Popover.Dropdown p={4}>
        <Stack gap={4}>
          <Box
            component="button"
            type="button"
            className={styles.card}
            onClick={() => cameraInputRef.current?.click()}
          >
            <input
              ref={cameraInputRef}
              type="file"
              accept={ACCEPT_IMAGES}
              capture="environment"
              className={styles.hiddenInput}
              onChange={handleInputChange}
            />

            <div className={styles.icon}>
              <MdPhotoCamera size={16} />
            </div>

            <Text fz={12} fw={500} className={styles.label}>
              Kamera ochish
            </Text>
          </Box>

          <Box
            component="button"
            type="button"
            className={styles.card}
            onClick={() => galleryInputRef.current?.click()}
          >
            <input
              ref={galleryInputRef}
              type="file"
              accept={ACCEPT_ALL}
              multiple
              className={styles.hiddenInput}
              onChange={handleInputChange}
            />

            <div className={styles.icon}>
              <MdPhotoLibrary size={16} />
            </div>

            <Text fz={12} fw={500} className={styles.label}>
              Fayl yuklash
            </Text>
          </Box>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
