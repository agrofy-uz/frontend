import API, { API_BASE_URL } from '../../api.interface';
import {
  AiChatLimitError,
  parseAiChatLimitedFromPayload,
} from '@/shared/lib/aiChatLimit';
import {
  ensureFreshAccessToken,
  isAuthErrorRequiringLogout,
  refreshAccessToken,
} from '@/shared/lib/authSession';
import { useAuthStore } from '../../../store/authStore';
import type {
  ChatHistoryItem,
  ChatMessagesResponse,
  CreateChatRequest,
  CreateChatResponse,
  MinimalResultRequest,
  MinimalResultResponse,
  SendChatMessageRequest,
  SendChatMessageResponse,
} from './ai.types';

function normalizeApiPath(path: string): string {
  const base = API_BASE_URL.replace(/\/$/, '');
  const p = path.startsWith('/') ? path : `/${path}`;
  return `${base}${p}`;
}

function parseSseDataPayload(
  payload: string,
  fullText: string,
  lastMeta: Partial<SendChatMessageResponse>,
): string {
  if (!payload || payload === '[DONE]') return fullText;
  try {
    const j = JSON.parse(payload) as Record<string, unknown>;
    const delta =
      (typeof j.text === 'string' ? j.text : '') ||
      (typeof j.content === 'string' ? j.content : '') ||
      (j.delta && typeof (j.delta as { content?: string }).content === 'string'
        ? (j.delta as { content: string }).content
        : '') ||
      (j.message && typeof (j.message as { text?: string }).text === 'string'
        ? (j.message as { text: string }).text
        : '');

    if (delta) fullText += delta;
    if (typeof j.id === 'string' || typeof j.id === 'number')
      lastMeta.id = String(j.id);
    if (j.role === 'user' || j.role === 'assistant') lastMeta.role = j.role;
    if (typeof j.createdAt === 'string') lastMeta.createdAt = j.createdAt;
    if (j.aiChatLimited !== undefined) lastMeta.aiChatLimited = j.aiChatLimited;
    if (j.AiChatLimited !== undefined) lastMeta.aiChatLimited = j.AiChatLimited;
    return fullText;
  } catch {
    return fullText + payload;
  }
}

function processSseBlock(
  block: string,
  fullText: string,
  lastMeta: Partial<SendChatMessageResponse>,
  onDelta?: (text: string) => void,
): string {
  let next = fullText;
  for (const line of block.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('data:')) continue;
    const payload = trimmed.slice(5).trim();
    next = parseSseDataPayload(payload, next, lastMeta);
    onDelta?.(next);
  }
  return next;
}

export const createChat = async (
  data: CreateChatRequest,
): Promise<CreateChatResponse> => {
  const response = await API.post<CreateChatResponse>('/ai/chats/new', data);
  return response.data;
};

/**
 * POST — javob odatda text/event-stream (SSE). Har bir data: qatorida JSON yoki matn bo'lishi mumkin.
 */
async function fetchWithAuth(
  url: string,
  init: RequestInit,
  retried = false,
): Promise<Response> {
  await ensureFreshAccessToken();
  const { accessToken } = useAuthStore.getState();
  const headers = new Headers(init.headers);
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

  const res = await fetch(url, { ...init, headers });

  if (res.status === 401 && !retried) {
    try {
      await refreshAccessToken();
      return fetchWithAuth(url, init, true);
    } catch (err) {
      if (isAuthErrorRequiringLogout(err)) {
        useAuthStore.getState().logout();
      }
      throw new Error('Unauthorized');
    }
  }

  return res;
}

export const sendChatMessage = async (
  chatId: string,
  data: SendChatMessageRequest,
  onDelta?: (accumulatedText: string) => void,
): Promise<SendChatMessageResponse> => {
  const url = normalizeApiPath(`/ai/chats/${chatId}/messages`);

  const res = await fetchWithAuth(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream, application/json',
    },
    body: JSON.stringify(data),
  });

  if (res.status === 401) {
    useAuthStore.getState().logout();
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const errText = await res.text();
    let message = errText || `HTTP ${res.status}`;
    try {
      const j = JSON.parse(errText) as Record<string, unknown>;
      const parsed = parseAiChatLimitedFromPayload(j);
      if (parsed?.active) {
        const msg = j.message ?? j.Message;
        if (typeof msg === 'string' && msg.trim()) message = msg.trim();
        throw new AiChatLimitError(message, parsed.limitedUntil);
      }
    } catch (e) {
      if (e instanceof AiChatLimitError) throw e;
    }
    throw new Error(message);
  }

  const contentType = res.headers.get('content-type') || '';

  if (!contentType.includes('text/event-stream')) {
    const text = await res.text();
    if (!text.trim()) {
      return { role: 'assistant', text: '' };
    }
    try {
      const j = JSON.parse(text) as SendChatMessageResponse;
      if (j.text != null || j.role != null) {
        onDelta?.(j.text ?? '');
        return {
          id: j.id,
          role: j.role ?? 'assistant',
          text: j.text ?? '',
          createdAt: j.createdAt,
          aiChatLimited:
            (j as Record<string, unknown>).aiChatLimited ??
            (j as Record<string, unknown>).AiChatLimited,
        };
      }
    } catch {
      /* not JSON */
    }
    onDelta?.(text);
    return { role: 'assistant', text };
  }

  if (!res.body) {
    return { role: 'assistant', text: '' };
  }

  let fullText = '';
  const lastMeta: Partial<SendChatMessageResponse> = {};
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');
    buffer = parts.pop() ?? '';
    for (const part of parts) {
      if (part.trim()) {
        fullText = processSseBlock(part, fullText, lastMeta, onDelta);
      }
    }
  }
  if (buffer.trim()) {
    fullText = processSseBlock(buffer, fullText, lastMeta, onDelta);
  }

  return {
    id: lastMeta.id,
    role: lastMeta.role ?? 'assistant',
    text: fullText,
    createdAt: lastMeta.createdAt,
    aiChatLimited: lastMeta.aiChatLimited,
  };
};

export const getChatHistory = async (
  userId: string,
): Promise<ChatHistoryItem[]> => {
  const response = await API.get<ChatHistoryItem[]>('/ai/chats', {
    params: { userId },
  });
  return response.data;
};

/** Chatni o‘chirish — DELETE ?userId=... */
export const deleteChat = async (
  chatId: string,
  userId: string,
): Promise<void> => {
  await API.delete(`/ai/chats/${chatId}`, { params: { userId } });
};

/** Chatga kirganda — GET ?userId=... */
export const getChatMessages = async (
  chatId: string,
  userId: string,
): Promise<ChatMessagesResponse> => {
  const response = await API.get<ChatMessagesResponse>(
    `/ai/chats/${chatId}/messages`,
    { params: { userId } },
  );
  const d = response.data;
  return {
    chatId: d?.chatId ?? chatId,
    title: d?.title ?? '',
    messages: Array.isArray(d?.messages) ? d.messages : [],
  };
};

export const sendMinimalResult = async (
  data: MinimalResultRequest,
): Promise<MinimalResultResponse> => {
  const response = await API.post<MinimalResultResponse>('/chat/responses', {
    model: data.model,
    input: data.input,
    store: data.store ?? true,
    session_id: data.session_id,
  });
  return response.data;
};

export const transcribeAudio = async (
  audioFile: Blob,
): Promise<{ text: string }> => {
  const formData = new FormData();
  const fixedBlob = new Blob([audioFile], { type: 'audio/webm' });
  formData.append('audio', fixedBlob, 'audio.webm');

  const response = await API.post<{ text: string }>(
    '/v1/stt/convert',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};
