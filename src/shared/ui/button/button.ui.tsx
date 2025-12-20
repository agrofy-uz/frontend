import {
  Button as MantineButton,
  type ButtonProps as MantineButtonProps,
  useMantineTheme,
} from '@mantine/core';
import { type ButtonHTMLAttributes, type ReactNode, useState } from 'react';
import {
  BUTTON_DEFAULTS,
  BUTTON_HEIGHTS,
  BUTTON_TRANSITIONS,
  BUTTON_TRANSFORMS,
  BUTTON_SHADOWS,
  BUTTON_CURSORS,
  DEFAULT_COLOR_SHADE,
  HOVER_SHADE_OFFSET,
  ACTIVE_SHADE_OFFSET,
} from './button.const';

type ButtonProps = MantineButtonProps & {
  children?: ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  bg?: string;
  c?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({
  children,
  fullWidth = BUTTON_DEFAULTS.fullWidth,
  disabled = BUTTON_DEFAULTS.disabled,
  bg = BUTTON_DEFAULTS.bg,
  c = BUTTON_DEFAULTS.c,
  ...props
}: ButtonProps) => {
  const theme = useMantineTheme();
  const bdc =
    bg.split('.').length > 1
      ? bg.split('.').join('-')
      : `${bg}-${DEFAULT_COLOR_SHADE}`;

  // Hover va active uchun ranglarni aniqlash
  const getHoverBg = () => {
    if (disabled) return undefined;
    if (bg.includes('.')) {
      const [color, shade] = bg.split('.');
      const shadeNum = parseInt(shade);
      const hoverShade =
        shadeNum + HOVER_SHADE_OFFSET > 0
          ? shadeNum + HOVER_SHADE_OFFSET
          : shadeNum;
      const colorKey = color as keyof typeof theme.colors;
      if (theme.colors[colorKey]) {
        return theme.colors[colorKey][hoverShade];
      }
    }
    // Default green uchun
    return theme.colors.green[5];
  };

  const getActiveBg = () => {
    if (disabled) return undefined;
    if (bg.includes('.')) {
      const [color, shade] = bg.split('.');
      const shadeNum = parseInt(shade);
      const activeShade =
        shadeNum + ACTIVE_SHADE_OFFSET < 10
          ? shadeNum + ACTIVE_SHADE_OFFSET
          : shadeNum;
      const colorKey = color as keyof typeof theme.colors;
      if (theme.colors[colorKey]) {
        return theme.colors[colorKey][activeShade];
      }
    }
    // Default green uchun
    return theme.colors.green[7];
  };

  const hoverBgColor = getHoverBg();
  const activeBgColor = getActiveBg();
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const currentBg = disabled
    ? theme.colors.gray[2]
    : isActive && activeBgColor
      ? activeBgColor
      : isHovered && hoverBgColor
        ? hoverBgColor
        : bg;

  return (
    <MantineButton
      bg={currentBg}
      c={disabled ? theme.colors.gray[8] : c}
      fullWidth={fullWidth}
      bd={disabled ? 'transparent' : `1px solid var(--mantine-color-${bdc})`}
      disabled={disabled}
      data-disabled={disabled}
      h={{ base: BUTTON_HEIGHTS.base, md: BUTTON_HEIGHTS.md }}
      style={{
        transition: `all ${BUTTON_TRANSITIONS.duration} ${BUTTON_TRANSITIONS.easing}`,
        cursor: disabled ? BUTTON_CURSORS.disabled : BUTTON_CURSORS.default,
        transform:
          isHovered && !isActive
            ? BUTTON_TRANSFORMS.hover
            : BUTTON_TRANSFORMS.default,
        boxShadow:
          isHovered && !isActive
            ? BUTTON_SHADOWS.hover
            : isActive
              ? BUTTON_SHADOWS.active
              : BUTTON_SHADOWS.none,
      }}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      onMouseDown={() => !disabled && setIsActive(true)}
      onMouseUp={() => !disabled && setIsActive(false)}
      {...props}
    >
      {children}
    </MantineButton>
  );
};

export default Button;
