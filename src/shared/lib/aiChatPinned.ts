export const AI_PINNED_STORAGE_KEY = 'agrofy-ai-pinned-chat-ids';

export const AI_CHAT_PINNED_CHANGED = 'aiChatPinnedChanged';

export type AiChatPinnedDetail = { chatId: string; pinned: boolean };

function readIds(): Set<string> {
  try {
    const raw = localStorage.getItem(AI_PINNED_STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return new Set();
    return new Set(arr.filter((x): x is string => typeof x === 'string'));
  } catch {
    return new Set();
  }
}

function writeIds(ids: Set<string>) {
  localStorage.setItem(AI_PINNED_STORAGE_KEY, JSON.stringify([...ids]));
}

export function isChatPinned(chatId: string): boolean {
  return readIds().has(chatId);
}

/** Yangi holatni qaytaradi (toggle dan keyin pinned yoki yo‘q). */
export function togglePinnedChat(chatId: string): boolean {
  const s = readIds();
  if (s.has(chatId)) {
    s.delete(chatId);
    writeIds(s);
    return false;
  }
  s.add(chatId);
  writeIds(s);
  return true;
}

export function notifyChatPinnedChanged(detail: AiChatPinnedDetail) {
  window.dispatchEvent(
    new CustomEvent<AiChatPinnedDetail>(AI_CHAT_PINNED_CHANGED, { detail })
  );
}

/** Chat o‘chirilganda storage dan ham olib tashlash */
export function removePinnedChat(chatId: string): void {
  const s = readIds();
  if (!s.has(chatId)) return;
  s.delete(chatId);
  writeIds(s);
  notifyChatPinnedChanged({ chatId, pinned: false });
}
