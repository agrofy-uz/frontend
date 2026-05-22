import { useEffect, useRef } from 'react';
import SiriWave, { type IiOS9Ranges } from 'siriwave';

export type SiriWavePlayerProps = {
  width?: number;
  height?: number;
  speed?: number;
  amplitude?: number;
  color?: string;
  lerpSpeed?: number;
  ranges?: IiOS9Ranges;
  isActive?: boolean;
  className?: string;
  /** SiriWave instance ga to'g'ridan kirish uchun */
  waveRef?: React.MutableRefObject<SiriWave | null>;
};

export function SiriWavePlayer({
  width = 300,
  height = 120,
  speed = 0.15,
  amplitude = 1.5,
  color,
  lerpSpeed = 0.04,
  ranges,
  isActive = true,
  className,
  waveRef,
}: SiriWavePlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<SiriWave | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const container = containerRef.current;
    if (!container) return undefined;

    container.replaceChildren();

    const wave = new SiriWave({
      container,
      style: 'ios9',
      width,
      height,
      speed,
      amplitude,
      lerpSpeed,
      autostart: false,
      ...(color ? { color } : {}),
      ...(ranges ? { ranges } : {}),
    });

    instanceRef.current = wave;
    if (waveRef) waveRef.current = wave;

    if (isActive) wave.start();

    return () => {
      wave.dispose();
      instanceRef.current = null;
      if (waveRef) waveRef.current = null;
    };
  // ranges — reference emas, qiymat bo'yicha (parentda barqaror konstanta tavsiya)
  }, [width, height, color, lerpSpeed]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const wave = instanceRef.current;
    if (!wave) return;
    if (isActive) wave.start();
    else wave.stop();
  }, [isActive]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width, height, lineHeight: 0, overflow: 'hidden' }}
      aria-hidden
    />
  );
}
