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

/** Telegram botni yangi oynada/tabda ochish (bir bosish — bitta marta). */
export function openTelegramBot(link: string): void {
  if (!consumeTelegramNavigation()) return;
  window.open(link, '_blank', 'noopener,noreferrer');
}
