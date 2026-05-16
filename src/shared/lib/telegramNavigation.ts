import { TELEGRAM_BOT_USERNAME } from '@/shared/ui/login-modal/login-modal.const';

export type TelegramBotIntent =
  | { kind: 'start'; value: string }
  | { kind: 'text'; value: string };

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

function buildWebUrl(intent: TelegramBotIntent): string {
  const base = `https://t.me/${TELEGRAM_BOT_USERNAME}`;
  if (intent.kind === 'start') {
    return `${base}?start=${encodeURIComponent(intent.value)}`;
  }
  return `${base}?text=${encodeURIComponent(intent.value)}`;
}

/** Mobil Telegram ilovasi — asosiy brauzer tabi Agrofyda qoladi. */
function buildAppUrl(intent: TelegramBotIntent): string | null {
  if (intent.kind === 'text') return null;
  return `tg://resolve?domain=${TELEGRAM_BOT_USERNAME}&start=${encodeURIComponent(intent.value)}`;
}

function isMobileTelegramContext(): boolean {
  if (typeof window === 'undefined') return false;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const narrow = window.matchMedia('(max-width: 48em)').matches;
  return coarse && narrow;
}

function launchHiddenDeepLink(url: string): void {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('aria-hidden', 'true');
  iframe.style.cssText =
    'display:none;position:fixed;width:0;height:0;border:0;opacity:0;pointer-events:none';
  iframe.src = url;
  document.body.appendChild(iframe);
  window.setTimeout(() => {
    iframe.remove();
  }, 2500);
}

type ClickLike = { preventDefault(): void; stopPropagation(): void };

/**
 * Telegramga o‘tish: mobilda tg:// (sahifa almashmaydi), desktopda yangi tab.
 * Telegram ilovasidan qaytganda brauzer tabi odatda Agrofyda qoladi.
 */
export function openTelegram(
  intent: TelegramBotIntent,
  event?: ClickLike,
): void {
  event?.preventDefault();
  event?.stopPropagation();
  if (!consumeTelegramNavigation()) return;

  const webUrl = buildWebUrl(intent);
  const appUrl = buildAppUrl(intent);

  if (isMobileTelegramContext() && appUrl) {
    launchHiddenDeepLink(appUrl);
    window.setTimeout(() => {
      if (document.visibilityState === 'visible') {
        window.open(webUrl, '_blank', 'noopener,noreferrer');
      }
    }, 1200);
    return;
  }

  window.open(webUrl, '_blank', 'noopener,noreferrer');
}

export function openTelegramPremium(event?: ClickLike): void {
  openTelegram({ kind: 'start', value: 'premium' }, event);
}

export function openTelegramHelp(event?: ClickLike): void {
  openTelegram({ kind: 'text', value: '/help' }, event);
}
