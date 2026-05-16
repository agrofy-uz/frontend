import type { MouseEvent } from 'react';

export const TELEGRAM_LINK_TARGET = '_blank';
export const TELEGRAM_LINK_REL = 'noopener noreferrer';

let navigationLocked = false;
let unlockTimer: ReturnType<typeof setTimeout> | null = null;

function consumeTelegramNavigation(): boolean {
  if (navigationLocked) return false;
  navigationLocked = true;
  if (unlockTimer) clearTimeout(unlockTimer);
  unlockTimer = setTimeout(() => {
    navigationLocked = false;
    unlockTimer = null;
  }, 2000);
  return true;
}

/**
 * `<a target="_blank">` uchun — birinchi bosish brauzerga qoldiriladi (mobilda web tab saqlanadi).
 * Takroriy touch/click dublikatini bloklaydi.
 */
export function guardTelegramAnchorClick(
  event: MouseEvent<HTMLAnchorElement>,
): void {
  if (consumeTelegramNavigation()) return;
  event.preventDefault();
  event.stopPropagation();
}
