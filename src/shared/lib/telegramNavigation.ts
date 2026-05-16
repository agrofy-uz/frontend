import { TELEGRAM_BOT_USERNAME } from '@/shared/ui/login-modal/login-modal.const';

export type TelegramBotIntent = { kind: 'start'; value: string };

/** Mobil: Telegram ilovasi ochilmasa t.me yangi tabda. */
const MOBILE_WEB_FALLBACK_MS = 500;

let navigationLocked = false;
let unlockTimer: ReturnType<typeof setTimeout> | null = null;

function consumeTelegramNavigation(): boolean {
  if (navigationLocked) return false;
  navigationLocked = true;
  if (unlockTimer) clearTimeout(unlockTimer);
  unlockTimer = setTimeout(() => {
    navigationLocked = false;
    unlockTimer = null;
  }, 1500);
  return true;
}

function buildWebUrl(intent: TelegramBotIntent): string {
  const base = `https://t.me/${TELEGRAM_BOT_USERNAME}`;
  return `${base}?start=${encodeURIComponent(intent.value)}`;
}

function buildAppUrlFromStart(start: string): string {
  return `tg://resolve?domain=${TELEGRAM_BOT_USERNAME}&start=${encodeURIComponent(start)}`;
}

function buildAppUrl(intent: TelegramBotIntent): string {
  return buildAppUrlFromStart(intent.value);
}

export function isMobileTelegramContext(): boolean {
  if (typeof window === 'undefined') return false;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const narrow = window.matchMedia('(max-width: 48em)').matches;
  return coarse && narrow;
}

/** t.me yoki API deepLink → tg:// */
export function resolveTelegramAppUrl(link: string): string | null {
  if (link.startsWith('tg://')) return link;

  try {
    const u = new URL(link);
    if (u.hostname !== 't.me' && u.hostname !== 'telegram.me') return null;

    const domain = u.pathname.replace(/^\//, '').split('/')[0];
    if (!domain) return null;

    const start = u.searchParams.get('start');
    if (start) return buildAppUrlFromStart(start);

    return `tg://resolve?domain=${domain}`;
  } catch {
    return null;
  }
}

/** Brauzer tabini almashtirmaydi — faqat Telegram ilovasini chaqiradi. */
function launchTelegramApp(url: string): void {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.style.cssText =
    'position:fixed;left:-9999px;top:-9999px;width:1px;height:1px;opacity:0';
  document.body.appendChild(anchor);
  anchor.click();
  requestAnimationFrame(() => anchor.remove());

  if (isMobileTelegramContext()) {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.style.cssText =
      'display:none;position:fixed;width:0;height:0;border:0;opacity:0';
    iframe.src = url;
    document.body.appendChild(iframe);
    window.setTimeout(() => iframe.remove(), 500);
  }
}

function openWebInNewTab(webUrl: string): void {
  window.open(webUrl, '_blank', 'noopener,noreferrer');
}

function scheduleMobileWebFallback(
  webUrl: string,
  appOpenedRef: { current: boolean },
): void {
  window.setTimeout(() => {
    if (!appOpenedRef.current && document.visibilityState === 'visible') {
      openWebInNewTab(webUrl);
    }
  }, MOBILE_WEB_FALLBACK_MS);
}

type ClickLike = { preventDefault(): void; stopPropagation(): void };

function runWithClickGuard(event: ClickLike | undefined, fn: () => void): void {
  event?.preventDefault();
  event?.stopPropagation();
  if (!consumeTelegramNavigation()) return;
  fn();
}

/**
 * Premium / bog‘lanish — mobile va desktop:
 * faqat tg:// (Telegram Desktop / mobil ilova), asosiy web tab Agrofyda qoladi.
 * t.me fallback faqat mobilda va ilova ochilmasa.
 */
function openPreservingWebTab(webUrl: string, appUrl: string): void {
  const appOpenedRef = { current: false };

  const onVisibility = () => {
    if (document.visibilityState === 'hidden') {
      appOpenedRef.current = true;
    }
  };

  document.addEventListener('visibilitychange', onVisibility);
  launchTelegramApp(appUrl);

  if (isMobileTelegramContext()) {
    scheduleMobileWebFallback(webUrl, appOpenedRef);
  }

  window.setTimeout(() => {
    document.removeEventListener('visibilitychange', onVisibility);
  }, MOBILE_WEB_FALLBACK_MS + 200);
}

/** Premium va «biz bilan bog‘laning» */
export function openTelegramPremium(event?: ClickLike): void {
  runWithClickGuard(event, () => {
    const intent: TelegramBotIntent = { kind: 'start', value: 'premium' };
    openPreservingWebTab(buildWebUrl(intent), buildAppUrl(intent));
  });
}

export function openTelegramHelp(event?: ClickLike): void {
  runWithClickGuard(event, () => {
    const intent: TelegramBotIntent = { kind: 'start', value: 'help' };
    openPreservingWebTab(buildWebUrl(intent), buildAppUrl(intent));
  });
}

/** Login: faqat mobilda web tab saqlanadi; desktop — yangi tab. */
export function openTelegramLoginLink(link: string, event?: ClickLike): void {
  runWithClickGuard(event, () => {
    if (isMobileTelegramContext()) {
      const appUrl = resolveTelegramAppUrl(link);
      if (appUrl) {
        const appOpenedRef = { current: false };
        const onVisibility = () => {
          if (document.visibilityState === 'hidden') appOpenedRef.current = true;
        };
        document.addEventListener('visibilitychange', onVisibility);
        launchTelegramApp(appUrl);
        scheduleMobileWebFallback(link, appOpenedRef);
        window.setTimeout(() => {
          document.removeEventListener('visibilitychange', onVisibility);
        }, MOBILE_WEB_FALLBACK_MS + 200);
        return;
      }
    }
    openWebInNewTab(link);
  });
}
