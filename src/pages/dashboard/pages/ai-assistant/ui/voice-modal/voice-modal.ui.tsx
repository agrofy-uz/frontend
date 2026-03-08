import {
  Modal,
  Button,
  Stack,
  Text,
  Group,
  ActionIcon,
  RingProgress,
  Transition,
  rem,
  Box,
} from '@mantine/core';
import { useState, useRef, useEffect } from 'react';
import { MdMic, MdStop, MdRefresh } from 'react-icons/md';
import { notifications } from '@mantine/notifications';
import { chatApi } from '@/shared/api/chat';
import { VOICE_MAX_DURATION, VOICE_MAX_SIZE } from '../../ai-assistant.const';

interface VoiceModalProps {
  opened: boolean;
  onClose: () => void;
  onTranscribed: (text: string) => void;
}

export function VoiceModal({ opened, onClose, onTranscribed }: VoiceModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset state when modal closes
  useEffect(() => {
    if (!opened) {
      stopRecordingLocally();
      setSeconds(0);
      setIsTranscribing(false);
    }
  }, [opened]);

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setStream(mediaStream);

      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });

        if (audioBlob.size > VOICE_MAX_SIZE) {
          notifications.show({
            title: 'Xatolik',
            message: 'Audio fayl hajmi juda katta (maks: 5MB)',
            color: 'red',
          });
          return;
        }

        handleTranscription(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start timer
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev >= VOICE_MAX_DURATION) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Mikrofonga ruxsat berilmadi:', err);
      notifications.show({
        title: 'Xatolik',
        message: 'Mikrofonga ruxsat berilmagan yoki qurilma topilmadi',
        color: 'red',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      stopRecordingLocally();
    }
  };

  const stopRecordingLocally = () => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleTranscription = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const response = await chatApi.transcribeAudio(blob);
      if (response.text?.trim()) {
        onTranscribed(response.text);
        onClose();
      } else {
        notifications.show({
          title: 'Ma\'lumot',
          message: 'Hech qanday gap aniqlanmadi',
          color: 'blue',
        });
      }
    } catch (err: any) {
      notifications.show({
        title: 'Xatolik',
        message: err.message || 'Transkripsiya qilishda xatolik yuz berdi',
        color: 'red',
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  const progressValue = (seconds / VOICE_MAX_DURATION) * 100;

  return (
    <Modal
      opened={opened}
      onClose={isTranscribing ? () => {} : onClose}
      title="Ovozli xabar"
      centered
      size="sm"
      radius="md"
      withCloseButton={!isTranscribing}
    >
      <Stack align="center" py="lg" gap="xl">
        <Box pos="relative">
          <RingProgress
            size={120}
            thickness={8}
            roundCaps
            sections={[{ value: progressValue, color: 'green' }]}
            label={
              <ActionIcon
                color={isRecording ? 'red' : 'green'}
                size={80}
                radius="xl"
                variant="filled"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isTranscribing}
                style={{
                  boxShadow: isRecording ? '0 0 20px rgba(255, 0, 0, 0.3)' : 'none',
                  transition: 'all 0.3s ease',
                }}
              >
                {isRecording ? <MdStop size={40} /> : <MdMic size={40} />}
              </ActionIcon>
            }
          />
        </Box>

        <Stack gap={5} align="center">
          <Text fw={600} fz="lg" c={isRecording ? 'red' : 'inherit'}>
            {isRecording ? 'Yozilmoqda...' : isTranscribing ? 'Matnga o\'girilmoqda...' : 'Gapirishni boshlang'}
          </Text>
          <Text fz="sm" c="dimmed">
            {isRecording 
              ? `${seconds} / ${VOICE_MAX_DURATION} soniya` 
              : isTranscribing 
                ? 'Iltimos, kuting...' 
                : 'Tugmani bosing va gapiring'}
          </Text>
        </Stack>

        <Transition mounted={isTranscribing} transition="fade" duration={400}>
          {(styles) => (
            <Group style={styles} justify="center">
              <MdRefresh className="loading-spinner" size={rem(24)} style={{ color: 'var(--mantine-color-green-6)' }} />
            </Group>
          )}
        </Transition>

        {!isTranscribing && !isRecording && (
          <Button variant="light" color="gray" onClick={onClose} fullWidth radius="md">
            Bekor qilish
          </Button>
        )}
      </Stack>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spinner {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .loading-spinner {
          animation: spinner 1s linear infinite;
        }
      `}} />
    </Modal>
  );
}
