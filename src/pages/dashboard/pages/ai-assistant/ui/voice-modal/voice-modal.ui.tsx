import {
  Modal,
  Stack,
  Text,
  Group,
  ActionIcon,
  rem,
  Box,
  Progress,
  Slider,
  Button as MantineButton,
} from '@mantine/core';
import { Button } from '@/shared/ui/button';
import { SiriWavePlayer, SiriWavePlayerDemo } from '@/shared/ui/siriwave-player';
import { useState, useRef, useEffect, useCallback } from 'react';
import { MdMic, MdPlayArrow, MdPause, MdRefresh, MdSend } from 'react-icons/md';
import { notifications } from '@mantine/notifications';
import { transcribeAudio } from '@/shared/api';
import { VOICE_MAX_DURATION, VOICE_MAX_SIZE } from '../../ai-assistant.const';
import { VoiceModalStopButton } from './voice-modal-stop-button';
import styles from './voice-modal.module.css';

interface VoiceModalProps {
  opened: boolean;
  onClose: () => void;
  onTranscribed: (text: string) => void;
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function VoiceModal({
  opened,
  onClose,
  onTranscribed,
}: VoiceModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedDuration, setRecordedDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(0);
  const [waveWidth, setWaveWidth] = useState(240);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const waveTrackRef = useRef<HTMLDivElement | null>(null);

  const isRecorded = recordedBlob != null;

  const stopRecordingLocally = useCallback(() => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  useEffect(() => {
    if (!opened) {
      stopRecordingLocally();
      setSeconds(0);
      setIsTranscribing(false);
      setRecordedBlob(null);
      setRecordedDuration(0);
      setIsPlaying(false);
      setPlaybackProgress(0);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    }
  }, [opened, stopRecordingLocally]);

  useEffect(() => {
    const el = waveTrackRef.current;
    if (!el || !isRecording) return undefined;

    const syncWidth = () => {
      setWaveWidth(Math.max(120, Math.floor(el.clientWidth)));
    };

    syncWidth();
    const ro = new ResizeObserver(syncWidth);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      setStream(mediaStream);

      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mediaRecorder.mimeType || 'audio/webm',
        });
        if (blob.size > VOICE_MAX_SIZE) {
          notifications.show({
            title: 'Xatolik',
            message: 'Audio fayl hajmi juda katta (maks: 5MB)',
            color: 'red',
          });
          return;
        }
        setRecordedBlob(blob);
        setRecordedDuration(seconds);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordedBlob(null);
      setSeconds(0);

      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev >= VOICE_MAX_DURATION) {
            if (mediaRecorderRef.current?.state === 'recording') {
              mediaRecorderRef.current.stop();
              stopRecordingLocally();
            }
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

  const handlePlayPause = () => {
    if (!recordedBlob) return;
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    const url = URL.createObjectURL(recordedBlob);
    blobUrlRef.current = url;
    if (!audioRef.current) {
      const audio = new Audio();
      audioRef.current = audio;
      audio.onended = () => {
        setIsPlaying(false);
        setPlaybackProgress(100);
        if (blobUrlRef.current) {
          URL.revokeObjectURL(blobUrlRef.current);
          blobUrlRef.current = null;
        }
      };
      audio.ontimeupdate = () => {
        if (audio.duration) {
          setPlaybackProgress((audio.currentTime / audio.duration) * 100);
        }
      };
    }
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.src = url;
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSendTranscribe = async () => {
    if (!recordedBlob) return;
    setIsTranscribing(true);
    try {
      const response = await transcribeAudio(recordedBlob);
      if (response.text?.trim()) {
        onTranscribed(response.text);
        onClose();
      } else {
        notifications.show({
          title: "Ma'lumot",
          message: 'Hech qanday gap aniqlanmadi',
          color: 'blue',
        });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Transkripsiya qilishda xatolik yuz berdi';
      notifications.show({
        title: 'Xatolik',
        message,
        color: 'red',
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleRecordAgain = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    setRecordedBlob(null);
    setRecordedDuration(0);
    setIsPlaying(false);
    setPlaybackProgress(0);
    setSeconds(0);
    startRecording();
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
      styles={{
        title: { fontWeight: 600, fontSize: rem(18) },
      }}
    >
      <Stack align="stretch" py="md" gap="xl">
        <Box className={styles.voiceStrip}>
          {!isRecorded && !isRecording && !isTranscribing && (
            <>
              <SiriWavePlayerDemo />
              <Stack align="center" gap="xs" pb="md">
                <Text fw={600} fz="lg" c="dimmed" ta="center">
                  Tez kunda
                </Text>
                <Text fz="sm" c="dimmed" ta="center">
                  Ovozli xabar xususiyati yaqinda qo‘shiladi
                </Text>
              </Stack>
            </>
          )}

          {!isRecorded && !isRecording && !isTranscribing && (
            <Stack align="center" gap="lg">
              <ActionIcon
                color="green"
                size={72}
                radius="xl"
                variant="filled"
                onClick={startRecording}
                disabled={isTranscribing}
                style={{
                  boxShadow: '0 4px 14px rgba(34, 197, 94, 0.4)',
                  transition: 'transform 0.2s ease',
                }}
              >
                <MdMic size={40} />
              </ActionIcon>
              <Text fw={500} fz="md" c="dimmed" ta="center">
                Mikrofonni bosib gapirishni boshlang
              </Text>
            </Stack>
          )}

          {(isRecording || isRecorded) && !isTranscribing && (
            <>
              <Group wrap="nowrap" align="center" justify="space-between">
                {isRecording ? (
                  <VoiceModalStopButton onClick={stopRecording} />
                ) : (
                  <ActionIcon
                    color="green"
                    size="lg"
                    radius="xl"
                    variant="filled"
                    onClick={handlePlayPause}
                    style={{ flexShrink: 0 }}
                  >
                    {isPlaying ? (
                      <MdPause size={24} />
                    ) : (
                      <MdPlayArrow size={24} />
                    )}
                  </ActionIcon>
                )}
                <Box ref={waveTrackRef} className={styles.waveTrack}>
                  {isRecording ? (
                    <SiriWavePlayer
                      width={waveWidth}
                      height={48}
                      speed={0.25}
                      amplitude={1.2}
                      color="#22c55e"
                      isActive={isRecording}
                    />
                  ) : (
                    <Slider
                      value={playbackProgress}
                      onChange={() => {}}
                      size="sm"
                      color="green"
                      radius="xl"
                      min={0}
                      max={100}
                      step={0.1}
                      styles={{ root: { pointerEvents: 'none', width: '100%' } }}
                    />
                  )}
                </Box>
                <Text fw={600} fz="sm" className={styles.duration}>
                  {isRecording
                    ? formatTime(seconds)
                    : formatTime(recordedDuration)}
                </Text>
              </Group>
              {isRecording && (
                <>
                  <Progress
                    value={progressValue}
                    size="xs"
                    color="green"
                    radius="xl"
                    mt="sm"
                  />
                  <Text className={styles.recordedSeconds} mt={4}>
                    {seconds} / {VOICE_MAX_DURATION} soniya
                  </Text>
                </>
              )}
              {isRecorded && (
                <>
                  <Text className={styles.recordedSeconds} mt="xs">
                    {recordedDuration} soniya yozildi
                  </Text>
                  <Group grow mt="md">
                    <MantineButton
                      variant="outline"
                      color="gray"
                      leftSection={<MdRefresh size={18} />}
                      onClick={handleRecordAgain}
                      radius="xl"
                      h={36}
                    >
                      Qayta yozish
                    </MantineButton>
                    <Button
                      color="green"
                      leftSection={<MdSend size={18} />}
                      onClick={handleSendTranscribe}
                      radius="xl"
                      h={36}
                    >
                      Matnga o'girish
                    </Button>
                  </Group>
                </>
              )}
            </>
          )}

          {isTranscribing && (
            <Stack align="center" gap="md" py="md">
              <MdRefresh
                className={styles.loadingSpinner}
                size={rem(32)}
                style={{ color: 'var(--mantine-color-green-6)' }}
              />
              <Text fw={500} c="dimmed">
                Matnga o'girilmoqda...
              </Text>
            </Stack>
          )}
        </Box>

        {!isRecorded && !isRecording && !isTranscribing && (
          <MantineButton
            variant="outline"
            onClick={onClose}
            fullWidth
            radius="xl"
            h={36}
          >
            Bekor qilish
          </MantineButton>
        )}
      </Stack>
    </Modal>
  );
}
