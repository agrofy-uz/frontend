/**
 * AI Assistant constants and helper functions
 */

export const MAX_TEXTAREA_HEIGHT = 160;
/** Bitta qator balandligi (font 16px × line-height 1.5 + padding) */
export const MIN_TEXTAREA_HEIGHT = 32;
export const DEFAULT_MODEL = 'gpt-3.5-turbo';

/** Mobil layout — CSS (48em) bilan bir xil */
export const AI_ASSISTANT_MOBILE_MQ = '(max-width: 48em)';

/** Input ostida doim ko‘rinadigan ogohlantirish */
export const AI_TRUST_DISCLAIMER =
  "AI javoblariga to'liq ishonmang — muhim ma'lumotlarni mustaqil tekshiring.";
export const AI_TRUST_DISCLAIMER_MOBILE =
  'AI javoblarini tekshirib foydalaning.';

export const AI_CHAT_LIMIT_TITLE = 'Limitiz tugadi';
export const AI_CHAT_LIMIT_NEXT_WRITE = 'Keyingi yozish vaqti';
export const AI_CHAT_LIMIT_UPGRADE = 'Tarifni yangilash';
export const AI_CHAT_LIMIT_MESSAGE =
  'Savol limiti tugadi. Keyingi yozish uchun kuting:';
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
