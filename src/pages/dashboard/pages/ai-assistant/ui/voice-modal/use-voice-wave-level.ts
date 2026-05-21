import { useEffect, useRef } from 'react';
import type SiriWave from 'siriwave';

/** Tinch holat — pastroq, sekin nafas */
const IDLE_BASE = 0.95;
const IDLE_SWAY = 0.28;
const IDLE_PERIOD = 3000;
const IDLE_SPEED = 0.1;

/** Yozish — balandroq bazaviy + ovozga qarab sakrash */
const REC_FLOOR = 3.2;
const REC_GAIN = 8.5;
const REC_MAX = 10;
const REC_SPEED_BASE = 0.22;
const REC_SPEED_GAIN = 0.18;

/** Qayta eshitish */
const PLAY_FLOOR = 2.8;
const PLAY_GAIN = 7;
const PLAY_MAX = 9;
const PLAY_SPEED_BASE = 0.16;

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

  useEffect(() => {
    recordingRef.current = isRecording;
  }, [isRecording]);

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
      teardown();
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
          analyser.smoothingTimeConstant = 0.45;
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

    if (isPlaying && audioElement) {
      const bindPlayback = async () => {
        try {
          let ctx = audioCtxRef.current;
          if (!ctx || ctx.state === 'closed') {
            ctx = new AudioContext();
            audioCtxRef.current = ctx;
          }
          await ctx.resume();
          if (!playBoundRef.current) {
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 2048;
            analyser.smoothingTimeConstant = 0.5;
            const src = ctx.createMediaElementSource(audioElement);
            src.connect(analyser);
            analyser.connect(ctx.destination);
            analyserRef.current = analyser;
            playBoundRef.current = true;
          }
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

      const wave = waveRef.current;
      if (wave) {
        const analyser = analyserRef.current;
        const recording = recordingRef.current;

        if (recording) {
          const level = analyser ? readMicLevel(analyser) : 0.12;
          const amp = clamp(REC_FLOOR + level * REC_GAIN, REC_FLOOR, REC_MAX);
          const spd = clamp(REC_SPEED_BASE + level * REC_SPEED_GAIN, REC_SPEED_BASE, 0.42);
          wave.setAmplitude(amp);
          wave.setSpeed(spd);
        } else if (analyser && isPlaying) {
          const level = readMicLevel(analyser);
          wave.setAmplitude(
            clamp(PLAY_FLOOR + level * PLAY_GAIN, PLAY_FLOOR, PLAY_MAX),
          );
          wave.setSpeed(clamp(PLAY_SPEED_BASE + level * 0.12, PLAY_SPEED_BASE, 0.32));
        } else {
          const phase = (Date.now() % IDLE_PERIOD) / IDLE_PERIOD;
          wave.setAmplitude(IDLE_BASE + Math.sin(phase * Math.PI * 2) * IDLE_SWAY);
          wave.setSpeed(IDLE_SPEED);
        }
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
  }, [enabled, isRecording, isPlaying, waveRef]);

  return null;
}
