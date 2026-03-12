import { ActionIcon } from '@mantine/core';
import { MdStop } from 'react-icons/md';
import styles from './voice-modal.module.css';

interface VoiceModalStopButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function VoiceModalStopButton({ onClick, disabled }: VoiceModalStopButtonProps) {
  return (
    <ActionIcon
      size="lg"
      radius="xl"
      variant="filled"
      onClick={onClick}
      disabled={disabled}
      className={styles.stopButton}
    >
      <MdStop size={24} />
    </ActionIcon>
  );
}
