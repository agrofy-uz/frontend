import {
  Modal,
  Text,
  ActionIcon,
  rem,
  Box,
} from '@mantine/core';
import { useRef, useState, useEffect, useCallback } from 'react';
import {
  MdMic,
  MdStop,
  MdPlayArrow,
  MdPause,
  MdSend,
} from 'react-icons/md';
import { notifications } from '@mantine/notifications';
import type SiriWave from 'siriwave';
import { SiriWavePlayer } from '@/shared/ui/siriwave-player';
import { transcribeAudio } from '@/shared/api';
import { VOICE_MAX_DURATION, VOICE_MAX_SIZE } from '../../ai-assistant.const';
import { useVoiceWaveLevel } from './use-voice-wave-level';
import styles from './voice-modal.module.css';

const WAVE_HEIGHT = 180;
const WAVE_COLOR = '#22c55e';
/** Inline object har renderda SiriWave ni qayta yaratardi — barqaror konstanta */
const WAVE_RANGES = {
  amplitude: [0.4, 5.5] as [number, number],
  width: [1.2, 3] as [number, number],
  speed: [0.06, 0.4] as [number, number],
};

export interface VoiceModalProps {
  opened: boolean;
  onClose: () => void;
  onTranscribed: (text: string) => void;
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function VoiceModal({ opened, onClose, onTranscribed }: VoiceModalProps) {
  const [isRecording, setIsRecording]     = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [seconds, setSeconds]             = useState(0);
  const [stream, setStream]               = useState<MediaStream | null>(null);
  const [recordedBlob, setRecordedBlob]   = useState<Blob | null>(null);
  const [recordedDuration, setRecordedDuration] = useState(0);
  const [isPlaying, setIsPlaying]         = useState(false);
  const [waveWidth, setWaveWidth]         = useState(300);

  const waveInstanceRef   = useRef<SiriWave | null>(null);
  const waveHostRef       = useRef<HTMLDivElement | null>(null);
  const mediaRecorderRef  = useRef<MediaRecorder | null>(null);
  const chunksRef         = useRef<Blob[]>([]);
  const timerRef          = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsRef        = useRef(0);
  const [playbackAudio, setPlaybackAudio] = useState<HTMLAudioElement | null>(null);
  const blobUrlRef        = useRef<string | null>(null);
  const streamRef         = useRef<MediaStream | null>(null);
  const openedRef         = useRef(opened);

  const hasRecording = recordedBlob != null;
  const displaySeconds = isRecording ? seconds : hasRecording ? recordedDuration : 0;

  // ── amplitude ni to'g'ridan wave ga uzatamiz (React state yo'q) ──────────
  useVoiceWaveLevel({
    enabled: opened,
    isRecording,
    isPlaying,
    stream,
    audioElement: playbackAudio,
    waveRef: waveInstanceRef,
  });

  // ── waveHost kengligi ─────────────────────────────────────────────────────
  useEffect(() => {
    const el = waveHostRef.current;
    if (!el) return undefined;
    const sync = () => {
      const w = Math.max(260, Math.round(el.clientWidth / 4) * 4);
      setWaveWidth((prev) => (Math.abs(prev - w) < 8 ? prev : w));
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [opened]);

  useEffect(() => {
    openedRef.current = opened;
  }, [opened]);

  useEffect(() => {
    streamRef.current = stream;
  }, [stream]);

  const stopMediaStreamTracks = useCallback(() => {
    const active = streamRef.current;
    if (active) {
      active.getTracks().forEach((t) => {
        t.stop();
        t.enabled = false;
      });
      streamRef.current = null;
    }
    setStream(null);
  }, []);

  const clearRecordingTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /** Modal yopilganda — yozuvni bekor qilish, mikrofonni qo‘yib yuborish */
  const releaseAllMedia = useCallback(() => {
    clearRecordingTimer();

    const rec = mediaRecorderRef.current;
    if (rec && rec.state !== 'inactive') {
      try {
        rec.stop();
      } catch {
        /* allaqachon to‘xtagan */
      }
    }
    mediaRecorderRef.current = null;
    chunksRef.current = [];

    stopMediaStreamTracks();
    setIsRecording(false);
  }, [clearRecordingTimer, stopMediaStreamTracks]);

  const resetModalState = useCallback(() => {
    releaseAllMedia();
    setIsPlaying(false);
    setSeconds(0);
    secondsRef.current = 0;
    setIsTranscribing(false);
    setRecordedBlob(null);
    setRecordedDuration(0);
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
    setPlaybackAudio(null);
  }, [releaseAllMedia]);

  const handleModalClose = useCallback(() => {
    if (isTranscribing) return;
    resetModalState();
    onClose();
  }, [isTranscribing, resetModalState, onClose]);

  useEffect(() => {
    if (!opened) {
      resetModalState();
      return undefined;
    }

    const audio = new Audio();
    audio.onended = () => {
      setIsPlaying(false);
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
    setPlaybackAudio(audio);
    return () => {
      audio.pause();
      audio.src = '';
      setPlaybackAudio(null);
    };
  }, [opened, resetModalState]);

  useEffect(() => () => {
    releaseAllMedia();
  }, [releaseAllMedia]);

  useEffect(() => { secondsRef.current = seconds; }, [seconds]);

  const stopRecording = useCallback(() => {
    clearRecordingTimer();
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;
    stopMediaStreamTracks();
    setIsRecording(false);
  }, [clearRecordingTimer, stopMediaStreamTracks]);

  // ── Yozish ───────────────────────────────────────────────────────────────
  const startRecording = async () => {
    if (isRecording || isTranscribing) return;
    setRecordedBlob(null); setRecordedDuration(0); setSeconds(0); secondsRef.current = 0;
    if (playbackAudio) { playbackAudio.pause(); setIsPlaying(false); }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (!openedRef.current) {
        mediaStream.getTracks().forEach((t) => t.stop());
        return;
      }

      streamRef.current = mediaStream;
      setStream(mediaStream);

      const rec = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = rec;
      chunksRef.current = [];

      rec.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        if (!openedRef.current) return;
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' });
        if (blob.size > VOICE_MAX_SIZE) {
          notifications.show({
            title: 'Xatolik',
            message: 'Fayl hajmi juda katta (maks 5MB)',
            color: 'red',
          });
          return;
        }
        setRecordedBlob(blob);
        setRecordedDuration(secondsRef.current);
      };

      rec.start();
      setIsRecording(true);

      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev >= VOICE_MAX_DURATION) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch {
      notifications.show({ title: 'Xatolik', message: "Mikrofonga ruxsat yo'q", color: 'red' });
    }
  };

  const handleRecordToggle = () => {
    if (isTranscribing) return;
    if (isRecording) stopRecording(); else void startRecording();
  };

  // ── Qayta eshitish ────────────────────────────────────────────────────────
  const handlePlayPause = () => {
    if (!recordedBlob || !playbackAudio || isRecording || isTranscribing) return;
    if (isPlaying) { playbackAudio.pause(); setIsPlaying(false); return; }
    if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    const url = URL.createObjectURL(recordedBlob);
    blobUrlRef.current = url;
    playbackAudio.src = url;
    void playbackAudio.play();
    setIsPlaying(true);
  };

  // ── Yuborish ─────────────────────────────────────────────────────────────
  const handleSendTranscribe = async () => {
    if (!recordedBlob || isTranscribing) return;
    setIsTranscribing(true);
    if (playbackAudio) { playbackAudio.pause(); setIsPlaying(false); }
    try {
      const res = await transcribeAudio(recordedBlob);
      if (res.text?.trim()) { onTranscribed(res.text); onClose(); }
      else notifications.show({ title: "Ma'lumot", message: 'Gap aniqlanmadi', color: 'blue' });
    } catch (err: unknown) {
      notifications.show({
        title: 'Xatolik',
        message: err instanceof Error ? err.message : 'Transkripsiya xatoligi',
        color: 'red',
      });
    } finally { setIsTranscribing(false); }
  };

  return (
    <Modal
      opened={opened}
      onClose={isTranscribing ? () => {} : handleModalClose}
      title="Ovozli xabar"
      centered
      size="sm"
      radius="md"
      withCloseButton={!isTranscribing}
      styles={{ title: { fontWeight: 600, fontSize: rem(18) }, body: { paddingTop: rem(8) } }}
    >
      <Box className={`${styles.shell} ${isTranscribing ? styles.shellTranscribing : ''}`}>
        {isTranscribing && (
          <Box className={styles.transcribingOverlay}>
            <Text className={styles.transcribingText} size="sm">Matnga o&apos;girilmoqda...</Text>
          </Box>
        )}

        {/* To'lqin */}
        <Box className={styles.waveZone}>
          <Box ref={waveHostRef} className={styles.waveHost}>
            <SiriWavePlayer
              waveRef={waveInstanceRef}
              width={waveWidth}
              height={WAVE_HEIGHT}
              color={WAVE_COLOR}
              amplitude={1}
              lerpSpeed={0.07}
              ranges={WAVE_RANGES}
              isActive
            />
          </Box>
        </Box>

        {/* Taymer */}
        <Text className={styles.timer} component="p">
          {formatTime(displaySeconds)}
        </Text>

        {/* Tugmalar — 1 qator: [Play] [Mic/Stop] [Send] */}
        <Box className={styles.controls}>
          {/* Chap: eshitish */}
          <ActionIcon
            className={`${styles.sideBtn} ${styles.sideBtnPlay}`}
            variant="filled"
            aria-label={isPlaying ? 'Pauza' : 'Eshitish'}
            onClick={handlePlayPause}
            disabled={!hasRecording || isRecording || isTranscribing}
          >
            {isPlaying ? <MdPause size={24} /> : <MdPlayArrow size={24} />}
          </ActionIcon>

          {/* O'rta: asosiy tugma */}
          <ActionIcon
            className={`${styles.recordBtn} ${isRecording ? styles.recordBtnRecording : ''}`}
            variant="filled"
            color={isRecording ? 'red' : 'green'}
            onClick={handleRecordToggle}
            disabled={isTranscribing}
            aria-label={isRecording ? "Yozishni to'xtatish" : 'Yozishni boshlash'}
          >
            {isRecording ? <MdStop size={38} /> : <MdMic size={38} />}
          </ActionIcon>

          {/* O'ng: yuborish (hozircha o'chirilgan) */}
          <ActionIcon
            className={`${styles.sideBtn} ${styles.sideBtnSend}`}
            variant="filled"
            color="green"
            aria-label="Yuborish"
            disabled
            onClick={() => void handleSendTranscribe()}
          >
            <MdSend size={22} />
          </ActionIcon>
        </Box>
      </Box>
    </Modal>
  );
}
