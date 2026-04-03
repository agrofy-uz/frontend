import type { ChatHistoryItem } from '@/shared/api';
import { isChatPinned } from '@/shared/lib/aiChatPinned';

/** Sidebar sarlavha «yozilishi» intervali (ms) */
export const SIDEBAR_TITLE_REVEAL_TICK_MS = 20;

/**
 * Bir intervalda nechta belgi qo‘shish: orqada qolgan oralig‘iga qarab,
 * katta sakrashlarni silliqroq yutib olish.
 */
export function getNextSidebarTitleVisibleLength(
  prevLength: number,
  targetLength: number
): number {
  if (prevLength >= targetLength) return targetLength;
  const gap = targetLength - prevLength;
  const step = Math.min(3, Math.max(1, Math.ceil(gap / 4)));
  return Math.min(prevLength + step, targetLength);
}

/** Dastlabki GET/SignalR ro‘yxati animatsiyasiz: shu vaqtdan keyin yangi chat silliq chiqadi */
export const SIDEBAR_TITLE_ANIM_GATE_MS = 450;

/** Qadalganlar yuqorida, updatedAt bo‘yicha kamayish */
export function sortAiSidebarChats(
  items: AiSidebarChatItem[]
): AiSidebarChatItem[] {
  return [...items].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.updatedAt - a.updatedAt;
  });
}
export type AiSidebarChatItem = {
  id: string;
  title: string;
  updatedAt: number;
  pinned?: boolean;
};

export function mapHistoryToSidebarItems(
  list: ChatHistoryItem[]
): AiSidebarChatItem[] {
  return list
    .filter((c) => c.title?.trim())
    .map((c) => ({
      id: c.chatId,
      title: c.title,
      updatedAt: new Date(c.updatedAt).getTime(),
      pinned: isChatPinned(c.chatId),
    }));
}
