import { useEffect, useRef } from 'react';
import type SiriWave from 'siriwave';

/** Tinch holat — pastroq, sekin nafas */
const IDLE_BASE = 0.95;
const IDLE_SWAY = 0.28;
const IDLE_PERIOD = 3000;
const IDLE_SPEED = 0.1;

/** Yozish — SiriWave ranges ichida (amplitude 0.4–5.5, speed 0.06–0.4) */
const REC_FLOOR = 1.8;
const REC_GAIN = 2.8;
const REC_MAX = 5;
const REC_SPEED_BASE = 0.12;
const REC_SPEED_GAIN = 0.14;

/** Qayta eshitish */
const PLAY_FLOOR = 1.6;
const PLAY_GAIN = 2.5;
const PLAY_MAX = 4.5;
const PLAY_SPEED_BASE = 0.1;

/** Frame-to-frame sakrashni yumshatish */
const SMOOTH = 0.14;

function readMicLevel(analyser: AnalyserNode): number {
  const time = new Uint8Array(analyser.fftSize);
  analyser.getByteTimeDomainData(time);

  let sumSq = 0;
  for (let i = 0; i < time.length; i += 1) {
    const n = ((time[i] ?? 128) - 128) / 128;
    sumSq += n * n;
  }
  const rms = Math.sqrt(sumSq / time.length);

  const freq = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(freq);
  let peak = 0;
  const len = Math.min(freq.length, 72);
  for (let i = 0; i < len; i += 1) {
    if ((freq[i] ?? 0) > peak) peak = freq[i] ?? 0;
  }
  const peakNorm = peak / 255;

  return Math.min(1, rms * 3.2 + peakNorm * 0.45);
}

function clamp(v: number, lo: number, hi: number) {
  return v < lo ? lo : v > hi ? hi : v;
}

type Args = {
  enabled: boolean;
  isRecording: boolean;
  isPlaying: boolean;
  stream: MediaStream | null;
  audioElement: HTMLAudioElement | null;
  waveRef: React.MutableRefObject<SiriWave | null>;
};

export function useVoiceWaveLevel({
  enabled,
  isRecording,
  isPlaying,
  stream,
  audioElement,
  waveRef,
}: Args) {
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playBoundRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const recordingRef = useRef(isRecording);
  const playingRef = useRef(isPlaying);
  const smoothAmpRef = useRef(IDLE_BASE);
  const smoothSpdRef = useRef(IDLE_SPEED);

  useEffect(() => {
    recordingRef.current = isRecording;
  }, [isRecording]);

  useEffect(() => {
    playingRef.current = isPlaying;
  }, [isPlaying]);

  const applySmooth = (targetAmp: number, targetSpd: number) => {
    smoothAmpRef.current += (targetAmp - smoothAmpRef.current) * SMOOTH;
    smoothSpdRef.current += (targetSpd - smoothSpdRef.current) * SMOOTH;
    const wave = waveRef.current;
    if (wave) {
      wave.setAmplitude(smoothAmpRef.current);
      wave.setSpeed(smoothSpdRef.current);
    }
  };

  useEffect(() => {
    if (!enabled) {
      analyserRef.current = null;
      playBoundRef.current = false;
      if (audioCtxRef.current) {
        void audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      return undefined;
    }

    let cancelled = false;

    const teardown = () => {
      analyserRef.current = null;
      playBoundRef.current = false;
      if (audioCtxRef.current) {
        void audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };

    if (isRecording && stream) {
      const bindMic = async () => {
        try {
          const ctx = new AudioContext();
          await ctx.resume();
          if (cancelled) {
            void ctx.close();
            return;
          }
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 2048;
          analyser.smoothingTimeConstant = 0.72;
          ctx.createMediaStreamSource(stream).connect(analyser);
          audioCtxRef.current = ctx;
          analyserRef.current = analyser;
        } catch {
          analyserRef.current = null;
        }
      };
      void bindMic();
      return () => {
        cancelled = true;
        teardown();
      };
    }

    if (isPlaying && audioElement && !isRecording) {
      const bindPlayback = async () => {
        try {
          let ctx = audioCtxRef.current;
          if (!ctx || ctx.state === 'closed') {
            ctx = new AudioContext();
            audioCtxRef.current = ctx;
          }
          await ctx.resume();
          if (cancelled || playBoundRef.current) return;
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 2048;
          analyser.smoothingTimeConstant = 0.65;
          const src = ctx.createMediaElementSource(audioElement);
          src.connect(analyser);
          analyser.connect(ctx.destination);
          analyserRef.current = analyser;
          playBoundRef.current = true;
        } catch {
          analyserRef.current = null;
        }
      };
      void bindPlayback();
      return () => {
        cancelled = true;
        teardown();
      };
    }

    teardown();
    return undefined;
  }, [enabled, isRecording, isPlaying, stream, audioElement]);

  useEffect(() => {
    if (!enabled) return undefined;

    let alive = true;

    const tick = () => {
      if (!alive) return;

      const recording = recordingRef.current;
      const playing = playingRef.current;
      const analyser = analyserRef.current;

      if (recording) {
        const level = analyser ? readMicLevel(analyser) : 0.08;
        applySmooth(
          clamp(REC_FLOOR + level * REC_GAIN, REC_FLOOR, REC_MAX),
          clamp(REC_SPEED_BASE + level * REC_SPEED_GAIN, REC_SPEED_BASE, 0.4),
        );
      } else if (playing && analyser) {
        const level = readMicLevel(analyser);
        applySmooth(
          clamp(PLAY_FLOOR + level * PLAY_GAIN, PLAY_FLOOR, PLAY_MAX),
          clamp(PLAY_SPEED_BASE + level * 0.1, PLAY_SPEED_BASE, 0.36),
        );
      } else {
        const phase = (Date.now() % IDLE_PERIOD) / IDLE_PERIOD;
        applySmooth(
          IDLE_BASE + Math.sin(phase * Math.PI * 2) * IDLE_SWAY,
          IDLE_SPEED,
        );
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      alive = false;
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [enabled, waveRef]);

  return null;
}
