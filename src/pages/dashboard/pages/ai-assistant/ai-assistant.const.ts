/**
 * AI Assistant constants and helper functions
 */

export const MAX_TEXTAREA_HEIGHT = 160;
export const DEFAULT_MODEL = 'gpt-3.5-turbo';

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
