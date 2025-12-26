import api from './api.interface';

// ChatGPT-style message format
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  id?: string;
  timestamp?: number;
  created_at?: string;
}

// Session types
export interface ChatSession {
  id: string;
  created_at?: string;
  updated_at?: string;
}

// ChatGPT-style request format (backend'ga moslashtirilgan)
export interface SendMessageRequest {
  session_id: string;
  messages: ChatMessage[]; // ChatGPT-style messages array
  model?: string; // Optional model name (e.g., 'gpt-5-nano', 'gpt-3.5-turbo')
  temperature?: number; // Optional temperature
  stream?: boolean; // Optional streaming
}

// Minimal result mode request (OpenAI /v1/responses endpoint uchun)
export interface MinimalResultRequest {
  model: string; // Model name (e.g., 'gpt-5-nano')
  input: string; // User input text
  store?: boolean; // Store response in backend
  session_id?: string; // Optional session ID
}

// Minimal result mode response
export interface MinimalResultResponse {
  id?: string;
  model?: string;
  output?: string;
  created?: number;
  session_id?: string;
}

// ChatGPT-style response format (backend'ga moslashtirilgan)
export interface ChatCompletionChoice {
  index: number;
  message: ChatMessage;
  finish_reason?: string;
}

export interface SendMessageResponse {
  id?: string;
  object?: string;
  created?: number;
  model?: string;
  choices: ChatCompletionChoice[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  // Backend compatibility fields
  reply?: string;
  message?: ChatMessage;
  session_id?: string;
}

// Session management
export interface CreateSessionResponse {
  session_id: string;
  session?: ChatSession;
}

export interface SessionHistoryResponse {
  messages: ChatMessage[];
}

export const chatApi = {
  // Yangi session yaratish
  createSession: async (): Promise<CreateSessionResponse> => {
    const response = await api.post<CreateSessionResponse>('/chat/session');
    return response.data;
  },

  // Session history olish
  getSessionHistory: async (
    sessionId: string
  ): Promise<SessionHistoryResponse> => {
    const response = await api.get<SessionHistoryResponse>(
      `/chat/session/${sessionId}`
    );
    return response.data;
  },

  // ChatGPT-style xabar yuborish
  sendMessage: async (
    data: SendMessageRequest
  ): Promise<SendMessageResponse> => {
    // Backend'ga moslashtirilgan request format
    // Agar backend hali messages array'ni qo'llab-quvvatlamasa,
    // oxirgi user xabarini message sifatida yuboramiz
    const backendRequest = {
      session_id: data.session_id,
      message: data.messages[data.messages.length - 1]?.content || '',
      messages: data.messages, // Backend yangi formatni qo'llab-quvvatlasa
      model: data.model,
      temperature: data.temperature,
      stream: data.stream,
    };

    const response = await api.post<SendMessageResponse>(
      '/chat/message',
      backendRequest
    );

    // Backend response'ni ChatGPT formatiga o'girish
    const responseData = response.data;

    // Agar backend reply yoki message qaytarsa, ChatGPT formatiga o'girish
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

    // Agar backend allaqachon ChatGPT formatida qaytarsa
    return responseData;
  },

  // To'g'ridan-to'g'ri ChatGPT API formatida yuborish (streaming support bilan)
  createCompletion: async (
    data: SendMessageRequest
  ): Promise<SendMessageResponse> => {
    return chatApi.sendMessage(data);
  },

  // Minimal result mode - OpenAI /v1/responses endpoint uchun
  // Bu backend orqali yuboriladi, minimal result talab qiladigan mode
  sendMinimalResult: async (
    data: MinimalResultRequest
  ): Promise<MinimalResultResponse> => {
    // Backend'ga yuborish - backend OpenAI API'ga yuboradi
    const response = await api.post<MinimalResultResponse>(
      '/chat/responses', // Backend endpoint
      {
        model: data.model,
        input: data.input,
        store: data.store ?? true,
        session_id: data.session_id,
      }
    );
    return response.data;
  },
};
