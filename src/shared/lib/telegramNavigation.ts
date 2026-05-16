import type { MouseEvent } from 'react';

let navigationLocked = false;
let unlockTimer: ReturnType<typeof setTimeout> | null = null;

/** Bir bosishda faqat bitta Telegram yo‘naltirish (touch + click dublikatidan himoya). */
export function consumeTelegramNavigation(): boolean {
  if (navigationLocked) return false;
  navigationLocked = true;
  if (unlockTimer) clearTimeout(unlockTimer);
  unlockTimer = setTimeout(() => {
    navigationLocked = false;
    unlockTimer = null;
  }, 2000);
  return true;
}

export function createTelegramLinkClickHandler(
  onBlocked?: () => void,
): (event: MouseEvent<HTMLAnchorElement>) => void {
  return (event) => {
    if (consumeTelegramNavigation()) return;
    event.preventDefault();
    event.stopPropagation();
    onBlocked?.();
  };
}
