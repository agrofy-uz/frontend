import { Box, RangeSlider, Stack, Text, useComputedColorScheme } from '@mantine/core';
import type { MantineSize } from '@mantine/core';
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useFloating,
} from '@floating-ui/react';
import type { ReactNode, RefObject } from 'react';
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';

export interface SliderProps {
  label?: string;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  min?: number;
  max?: number;
  /** @default 1 — ixtiyoriy qadam */
  step?: number;
  /** Yuqoridagi oralik matni (masalan «… so‘m») */
  formatThumb?: (n: number) => string;
  /** Thumb tooltip: faqat raqamlar (default Intl, birliksiz) */
  formatTooltip?: (n: number) => string;
  /** Track ustidagi nuqtalar; berilmasa — bo‘sh (faqat boshqaruvchilar) */
  marks?: { value: number; label?: ReactNode }[];
  size?: MantineSize;
  /** true bo‘lsa, thumb yozuvi doim ko‘rinadi; aks holda hover / surish / fokusda */
  labelAlwaysOn?: boolean;
  /** @default true */
  showLabelOnHover?: boolean;
}

const defaultFormatTooltip = (n: number) =>
  new Intl.NumberFormat('uz-UZ').format(n);

type ThumbIndex = 0 | 1;

function queryThumbs(root: HTMLElement | null): HTMLElement[] {
  if (!root) return [];
  return [...root.querySelectorAll<HTMLElement>('[role="slider"]')];
}

function SliderFloatingLabels({
  rootRef,
  lo,
  hi,
  formatTooltip,
  labelAlwaysOn,
  showLabelOnHover,
  hoveredThumb,
  activeThumb,
}: {
  rootRef: RefObject<HTMLDivElement | null>;
  lo: number;
  hi: number;
  formatTooltip: (n: number) => string;
  labelAlwaysOn: boolean;
  showLabelOnHover: boolean;
  hoveredThumb: ThumbIndex | null;
  activeThumb: ThumbIndex | null;
}) {
  const resolvedScheme = useComputedColorScheme('light');

  const open0 =
    labelAlwaysOn ||
    activeThumb === 0 ||
    (showLabelOnHover && hoveredThumb === 0);
  const open1 =
    labelAlwaysOn ||
    activeThumb === 1 ||
    (showLabelOnHover && hoveredThumb === 1);

  const labelBg =
    resolvedScheme === 'dark'
      ? 'var(--mantine-color-dark-4)'
      : 'var(--mantine-color-gray-9)';

  const fl0 = useFloating({
    placement: 'top',
    strategy: 'fixed',
    middleware: [
      offset(10),
      flip({ fallbackPlacements: ['bottom', 'top'] }),
      shift({ padding: 12, crossAxis: true }),
    ],
    whileElementsMounted: autoUpdate,
  });

  const fl1 = useFloating({
    placement: 'top',
    strategy: 'fixed',
    middleware: [
      offset(10),
      flip({ fallbackPlacements: ['bottom', 'top'] }),
      shift({ padding: 12, crossAxis: true }),
    ],
    whileElementsMounted: autoUpdate,
  });

  useLayoutEffect(() => {
    if (!open0) return;
    const thumbs = queryThumbs(rootRef.current);
    fl0.refs.setReference(thumbs[0] ?? null);
  }, [rootRef, lo, hi, open0, fl0.refs]);

  useLayoutEffect(() => {
    if (!open1) return;
    const thumbs = queryThumbs(rootRef.current);
    fl1.refs.setReference(thumbs[1] ?? null);
  }, [rootRef, lo, hi, open1, fl1.refs]);

  const floatStyle = (
    styles: ReturnType<typeof useFloating>['floatingStyles'],
  ) => ({
    ...styles,
    zIndex: 420,
    pointerEvents: 'none' as const,
    backgroundColor: labelBg,
    borderRadius: 'var(--mantine-radius-sm)',
    whiteSpace: 'nowrap' as const,
  });

  return (
    <FloatingPortal>
      {open0 ? (
        <Box
          ref={fl0.refs.setFloating}
          fz="xs"
          px={6}
          py={4}
          c="white"
          style={floatStyle(fl0.floatingStyles)}
        >
          {formatTooltip(lo)}
        </Box>
      ) : null}
      {open1 ? (
        <Box
          ref={fl1.refs.setFloating}
          fz="xs"
          px={6}
          py={4}
          c="white"
          style={floatStyle(fl1.floatingStyles)}
        >
          {formatTooltip(hi)}
        </Box>
      ) : null}
    </FloatingPortal>
  );
}

export function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 200,
  step = 1,
  formatThumb = (n) => `${n}`,
  formatTooltip = defaultFormatTooltip,
  marks,
  size = 'md',
  labelAlwaysOn = false,
  showLabelOnHover = true,
}: SliderProps) {
  const [lo, hi] = value;
  const rootRef = useRef<HTMLDivElement>(null);
  const [hoveredThumb, setHoveredThumb] = useState<ThumbIndex | null>(null);
  const [activeThumb, setActiveThumb] = useState<ThumbIndex | null>(null);

  useEffect(() => {
    const end = () => setActiveThumb(null);
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);
    return () => {
      window.removeEventListener('pointerup', end);
      window.removeEventListener('pointercancel', end);
    };
  }, []);

  /** Mantine Thumb `id` / `onPointerEnter` kabi prop'larni DOM ga uzatmaydi — tinglovchilar ref orqali */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const bind = () => {
      const thumbs = queryThumbs(root);
      const cleanups: (() => void)[] = [];

      thumbs.forEach((el, i) => {
        const idx = i as ThumbIndex;
        const onEnter = () => setHoveredThumb(idx);
        const onLeave = () => setHoveredThumb(null);
        const onDown = () => setActiveThumb(idx);
        el.addEventListener('pointerenter', onEnter);
        el.addEventListener('pointerleave', onLeave);
        el.addEventListener('pointerdown', onDown);
        cleanups.push(() => {
          el.removeEventListener('pointerenter', onEnter);
          el.removeEventListener('pointerleave', onLeave);
          el.removeEventListener('pointerdown', onDown);
        });
      });

      return () => cleanups.forEach((fn) => fn());
    };

    return bind();
  }, [value, lo, hi]);

  return (
    <Stack gap="xs">
      {label ? (
        <Text size="sm" fw={500}>
          {label}
        </Text>
      ) : null}
      <Text size="xs" c="dimmed">
        {formatThumb(lo)} — {formatThumb(hi)}
      </Text>
      <RangeSlider
        ref={rootRef}
        w="100%"
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        color="green"
        size={size}
        marks={marks ?? []}
        label={null}
        styles={{
          root: { overflow: 'visible' },
          trackContainer: { overflow: 'visible' },
        }}
      />
      <SliderFloatingLabels
        rootRef={rootRef}
        lo={lo}
        hi={hi}
        formatTooltip={formatTooltip}
        labelAlwaysOn={labelAlwaysOn}
        showLabelOnHover={showLabelOnHover}
        hoveredThumb={hoveredThumb}
        activeThumb={activeThumb}
      />
    </Stack>
  );
}
