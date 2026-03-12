import api from '../../api.interface';
import type {
  ChatMessage,
  CreateSessionResponse,
  SendMessageRequest,
  SendMessageResponse,
  SessionHistoryResponse,
  MinimalResultRequest,
  MinimalResultResponse,
} from './ai.types';

export const chatApi = {
  createSession: async (): Promise<CreateSessionResponse> => {
    const response = await api.post<CreateSessionResponse>('/chat/session');
    return response.data;
  },

  getSessionHistory: async (
    sessionId: string
  ): Promise<SessionHistoryResponse> => {
    const response = await api.get<SessionHistoryResponse>(
      `/chat/session/${sessionId}`
    );
    return response.data;
  },

  sendMessage: async (
    data: SendMessageRequest
  ): Promise<SendMessageResponse> => {
    const backendRequest = {
      session_id: data.session_id,
      message: data.messages[data.messages.length - 1]?.content || '',
      messages: data.messages,
      model: data.model,
      temperature: data.temperature,
      stream: data.stream,
    };

    const response = await api.post<SendMessageResponse>(
      '/chat/message',
      backendRequest
    );
    const responseData = response.data;

    if (responseData.reply || responseData.message) {
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: responseData.reply || responseData.message?.content || '',
        id: responseData.message?.id,
        timestamp: responseData.message?.timestamp,
        created_at: responseData.message?.created_at,
      };

      return {
        id: responseData.message?.id || `chatcmpl-${Date.now()}`,
        object: 'chat.completion',
        created: responseData.message?.timestamp
          ? Math.floor(responseData.message.timestamp / 1000)
          : Math.floor(Date.now() / 1000),
        model: data.model || 'gpt-3.5-turbo',
        choices: [
          {
            index: 0,
            message: assistantMessage,
            finish_reason: 'stop',
          },
        ],
        usage: {
          prompt_tokens: 0,
          completion_tokens: 0,
          total_tokens: 0,
        },
        session_id: responseData.session_id || data.session_id,
        reply: responseData.reply,
        message: responseData.message,
      };
    }

    return responseData;
  },

  createCompletion: async (
    data: SendMessageRequest
  ): Promise<SendMessageResponse> => {
    return chatApi.sendMessage(data);
  },

  sendMinimalResult: async (
    data: MinimalResultRequest
  ): Promise<MinimalResultResponse> => {
    const response = await api.post<MinimalResultResponse>(
      '/chat/responses',
      {
        model: data.model,
        input: data.input,
        store: data.store ?? true,
        session_id: data.session_id,
      }
    );
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
