import api from '../../api.interface';
import type {
  ChatMessageItem,
  ChatHistoryItem,
  CreateChatRequest,
  CreateChatResponse,
  MinimalResultRequest,
  MinimalResultResponse,
  SendChatMessageRequest,
  SendChatMessageResponse,
} from './ai.types';

export const chatApi = {
  createChat: async (data: CreateChatRequest): Promise<CreateChatResponse> => {
    const response = await api.post<CreateChatResponse>('/ai/chats/new', data);
    return response.data;
  },

  sendChatMessage: async (
    chatId: string,
    data: SendChatMessageRequest
  ): Promise<SendChatMessageResponse> => {
    const response = await api.post<SendChatMessageResponse>(
      `/ai/chats/${chatId}/messages`,
      data
    );
    return response.data;
  },

  getChatHistory: async (userId: string): Promise<ChatHistoryItem[]> => {
    const response = await api.get<ChatHistoryItem[]>('/ai/chats', {
      params: { userId },
    });
    return response.data;
  },

  getChatMessages: async (chatId: string): Promise<ChatMessageItem[]> => {
    const response = await api.post<ChatMessageItem[]>(
      `/ai/chats/${chatId}/messages`
    );
    return response.data;
  },

  sendMinimalResult: async (
    data: MinimalResultRequest
  ): Promise<MinimalResultResponse> => {
    const response = await api.post<MinimalResultResponse>('/chat/responses', {
      model: data.model,
      input: data.input,
      store: data.store ?? true,
      session_id: data.session_id,
    });
    return response.data;
  },

  transcribeAudio: async (audioFile: Blob): Promise<{ text: string }> => {
    const formData = new FormData();
    const fixedBlob = new Blob([audioFile], { type: 'audio/webm' });
    formData.append('audio', fixedBlob, 'audio.webm');

    const response = await api.post<{ text: string }>(
      '/v1/stt/convert',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },
};
