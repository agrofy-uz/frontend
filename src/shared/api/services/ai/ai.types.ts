export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  id?: string;
  timestamp?: number;
  created_at?: string;
}

export interface ChatSession {
  id: string;
  created_at?: string;
  updated_at?: string;
}

export interface MinimalResultRequest {
  model: string;
  input: string;
  store?: boolean;
  session_id?: string;
}

export interface MinimalResultResponse {
  id?: string;
  model?: string;
  output?: string;
  created?: number;
  session_id?: string;
}

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
  reply?: string;
  message?: ChatMessage;
  session_id?: string;
}

export interface ChatHistoryItem {
  chatId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateChatRequest {
  userId: string;
}

export interface CreateChatResponse {
  chatId: string;
  title?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SendChatMessageRequest {
  userId: string;
  text: string;
  role: 'user' | 'assistant';
}

export interface SendChatMessageResponse {
  id?: string;
  text?: string;
  role?: 'user' | 'assistant';
  createdAt?: string;
}

export interface ChatMessageItem {
  id?: string;
  text: string;
  role: 'user' | 'assistant';
  createdAt?: string;
}
