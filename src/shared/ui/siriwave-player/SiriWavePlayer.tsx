import { useEffect, useRef } from 'react';
import SiriWave from 'siriwave';

export type SiriWavePlayerProps = {
  width?: number;
  height?: number;
  speed?: number;
  amplitude?: number;
  color?: string;
  /** true — animatsiya ishlaydi; false — to‘xtatiladi */
  isActive?: boolean;
  className?: string;
};

export function SiriWavePlayer({
  width = 300,
  height = 120,
  speed = 0.2,
  amplitude = 1,
  color,
  isActive = true,
  className,
}: SiriWavePlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const waveRef = useRef<SiriWave | null>(null);

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
      autostart: false,
      ...(color ? { color } : {}),
    });

    waveRef.current = wave;
    if (isActive) {
      wave.start();
    }

    return () => {
      wave.dispose();
      waveRef.current = null;
    };
  }, [width, height, speed, amplitude, color]);

  useEffect(() => {
    const wave = waveRef.current;
    if (!wave) return;

    wave.setSpeed(speed);
    wave.setAmplitude(amplitude);
  }, [speed, amplitude]);

  useEffect(() => {
    const wave = waveRef.current;
    if (!wave) return;

    if (isActive) {
      wave.start();
    } else {
      wave.stop();
    }
  }, [isActive]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width, height, lineHeight: 0 }}
      aria-hidden
    />
  );
}
