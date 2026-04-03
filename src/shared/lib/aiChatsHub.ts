import * as signalR from '@microsoft/signalr';
import { API_BASE_URL } from '../api/api.interface';
import { useAuthStore } from '../store/authStore';
import type { ChatHistoryItem } from '../api/services/ai/ai.types';

export const AI_CHATS_LIST_SYNC = 'aiChatsListSync';

let hub: signalR.HubConnection | null = null;
let subscribedUserId: string | null = null;

export function getAiChatsHubUrl(): string {
  const base = API_BASE_URL.replace(/\/$/, '');
  const root = base.endsWith('/api') ? base.slice(0, -4) : base;
  return `${root}/hubs/ai-chats`;
}

function parseChatItem(raw: Record<string, unknown>): ChatHistoryItem | null {
  const chatId =
    (typeof raw.chatId === 'string' && raw.chatId) ||
    (typeof raw.id === 'string' && raw.id) ||
    '';
  const title = typeof raw.title === 'string' ? raw.title : '';
  const createdAt =
    typeof raw.createdAt === 'string'
      ? raw.createdAt
      : typeof raw.createdAt === 'number'
        ? new Date(raw.createdAt).toISOString()
        : new Date().toISOString();
  const updatedAt =
    typeof raw.updatedAt === 'string'
      ? raw.updatedAt
      : typeof raw.updatedAt === 'number'
        ? new Date(raw.updatedAt).toISOString()
        : createdAt;
  if (!chatId) return null;
  return { chatId, title, createdAt, updatedAt };
}

function normalizeToChatList(payload: unknown): ChatHistoryItem[] {
  if (payload == null) return [];
  if (Array.isArray(payload)) {
    return payload
      .map((x) =>
        x && typeof x === 'object'
          ? parseChatItem(x as Record<string, unknown>)
          : null
      )
      .filter((x): x is ChatHistoryItem => x != null);
  }
  if (typeof payload === 'object') {
    const o = payload as Record<string, unknown>;
    const arr =
      (Array.isArray(o.chats) && o.chats) ||
      (Array.isArray(o.items) && o.items) ||
      (Array.isArray(o.data) && o.data) ||
      null;
    if (arr) return normalizeToChatList(arr);
  }
  return [];
}

function dispatchChatList(chats: ChatHistoryItem[]) {
  window.dispatchEvent(
    new CustomEvent(AI_CHATS_LIST_SYNC, { detail: { chats } })
  );
}

function wireListHandlers(connection: signalR.HubConnection) {
  const onPayload = (...args: unknown[]) => {
    const first = args[0];
    dispatchChatList(normalizeToChatList(first));
  };

  const methodNames = [
    'Chats',
    'ReceiveChats',
    'chats',
    'receiveChats',
    'ChatList',
    'ChatListUpdated',
    'SyncChats',
  ];
  for (const name of methodNames) {
    connection.on(name, onPayload);
  }
}

async function invokeSubscribe(
  connection: signalR.HubConnection,
  uid: string
): Promise<void> {
  try {
    await connection.invoke('Subscribe', uid);
  } catch {
    await connection.invoke('subscribe', uid);
  }
}

export async function startAiChatsHub(userId: string): Promise<void> {
  if (!userId) return;
  if (
    hub?.state === signalR.HubConnectionState.Connected &&
    subscribedUserId === userId
  ) {
    return;
  }
  await stopAiChatsHub();

  subscribedUserId = userId;
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(getAiChatsHubUrl(), {
      accessTokenFactory: () => useAuthStore.getState().accessToken ?? '',
      withCredentials: true,
    })
    .withAutomaticReconnect()
    .build();

  wireListHandlers(connection);

  connection.onreconnected(async () => {
    if (subscribedUserId) {
      await invokeSubscribe(connection, subscribedUserId).catch(() => {});
    }
  });

  try {
    await connection.start();
    await invokeSubscribe(connection, userId);
  } catch (e) {
    subscribedUserId = null;
    await connection.stop().catch(() => {});
    throw e;
  }

  hub = connection;
}

export async function stopAiChatsHub(): Promise<void> {
  const c = hub;
  hub = null;
  subscribedUserId = null;
  if (c) {
    await c.stop().catch(() => {});
  }
}
