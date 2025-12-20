// Button default qiymatlari
export const BUTTON_DEFAULTS = {
  bg: 'green',
  c: 'white',
  fullWidth: false,
  disabled: false,
} as const;

// Button height qiymatlari
export const BUTTON_HEIGHTS = {
  base: 40,
  md: 48,
} as const;

// Button transition va animation qiymatlari
export const BUTTON_TRANSITIONS = {
  duration: '0.2s',
  easing: 'ease',
} as const;

// Button transform qiymatlari
export const BUTTON_TRANSFORMS = {
  hover: 'translateY(-1px)',
  active: 'translateY(0)',
  default: 'translateY(0)',
} as const;

// Button box-shadow qiymatlari
export const BUTTON_SHADOWS = {
  hover: '0 4px 8px rgba(0, 0, 0, 0.1)',
  active: '0 2px 4px rgba(0, 0, 0, 0.1)',
  none: 'none',
} as const;

// Button cursor qiymatlari
export const BUTTON_CURSORS = {
  default: 'pointer',
  disabled: 'not-allowed',
} as const;

// Default color shade
export const DEFAULT_COLOR_SHADE = 7;

// Hover shade offset (yengilroq rang uchun)
export const HOVER_SHADE_OFFSET = -1;

// Active shade offset (to'qroq rang uchun)
export const ACTIVE_SHADE_OFFSET = 1;
