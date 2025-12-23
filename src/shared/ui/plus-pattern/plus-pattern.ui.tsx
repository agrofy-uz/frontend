import { Box, useMantineColorScheme } from '@mantine/core';
import { useMemo, type ReactNode } from 'react';

interface PlusPatternProps {
  children?: ReactNode;
  spacing?: number; // Plus ikonlar orasidagi masofa (px)
  iconWidth?: number; // Plus ikon qalinligi (px)
  iconLength?: number; // Plus ikon uzunligi (px)
  color?: {
    dark: string; // Dark mode uchun rang
    light: string; // Light mode uchun rang
  };
  style?: React.CSSProperties;
}

const PlusPattern = ({
  children,
  spacing = 30,
  iconWidth = 1.5,
  iconLength = 9,
  color,
  style,
}: PlusPatternProps) => {
  const { colorScheme } = useMantineColorScheme();

  // Plus ikonni SVG pattern sifatida yaratish
  const plusPattern = useMemo(() => {
    const defaultColor =
      colorScheme === 'dark'
        ? color?.dark || '#2b2a2a' // Dark mode uchun oq rang
        : color?.light || '#f1f1f1'; // Light mode uchun qora rang

    const centerX = spacing / 2;
    const centerY = spacing / 2;
    const halfLength = iconLength / 2;
    const halfWidth = iconWidth / 2;
    const radius = iconWidth / 2; // Uchlar uchun radius

    // Plus ikon: gorizontal va vertikal chiziqlar (yumaloq uchlari bilan)
    const svg = `<svg width="${spacing}" height="${spacing}" xmlns="http://www.w3.org/2000/svg">
      <rect x="${centerX - halfLength}" y="${centerY - halfWidth}" width="${iconLength}" height="${iconWidth}" rx="${radius}" ry="${radius}" fill="${defaultColor}"/>
      <rect x="${centerX - halfWidth}" y="${centerY - halfLength}" width="${iconWidth}" height="${iconLength}" rx="${radius}" ry="${radius}" fill="${defaultColor}"/>
    </svg>`;

    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }, [colorScheme, spacing, iconWidth, iconLength, color]);

  return (
    <Box
      style={{
        minHeight: '100vh',
        backgroundImage: plusPattern,
        backgroundRepeat: 'repeat',
        ...style,
      }}
    >
      {children}
    </Box>
  );
};

export default PlusPattern;
