/**
 * AI Assistant constants and helper functions
 */

export const MAX_TEXTAREA_HEIGHT = 160;
export const DEFAULT_MODEL = 'gpt-3.5-turbo';

/** Mobil layout — CSS (48em) bilan bir xil */
export const AI_ASSISTANT_MOBILE_MQ = '(max-width: 48em)';

/** Pastga scroll — oxirgi xabar inputdan ~20px yuqoriroqda to‘xtaydi */
export const MOBILE_SCROLL_PAD_TRIM_PX = 20;

/** Xabarlar scroll qilinsa — input fokusdan chiqadi, klaviatura yopiladi */
export const MOBILE_SCROLL_DISMISS_PX = 48;

/** Klaviatura inset — kichik o‘zgarishlarni e’tiborsiz qoldirish (scroll jitter) */
export const KEYBOARD_INSET_STABLE_PX = 12;

/** Input ostida doim ko‘rinadigan ogohlantirish */
export const AI_TRUST_DISCLAIMER =
  "AI javoblariga to'liq ishonmang — muhim ma'lumotlarni mustaqil tekshiring.";
export const AI_TRUST_DISCLAIMER_MOBILE =
  'AI javoblarini tekshirib foydalaning.';
/**
 * Generates a short title for a chat based on the first AI response
 * @param content The assistant's reply content
 * @returns A string representing the chat title
 */
export const generateChatTitle = (content: string): string => {
  // Matndan birinchi 3-5 so'zni olish
  const words = content.trim().split(/\s+/).slice(0, 5);
  return words.join(' ') || 'Yangi chat';
};

/**
 * Framer Motion variants for message bubbles
 */
export const MESSAGE_ANIMATION_VARIANTS = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
};

/**
 * Framer Motion variants for typing indicator dots
 */
export const TYPING_DOT_ANIMATION = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0 },
};

export const VOICE_MAX_DURATION = 60; // 60 seconds
export const VOICE_MAX_SIZE = 5 * 1024 * 1024; // 5 MB
