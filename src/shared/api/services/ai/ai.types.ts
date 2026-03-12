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

export interface SendMessageRequest {
  session_id: string;
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  stream?: boolean;
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

export interface CreateSessionResponse {
  session_id: string;
  session?: ChatSession;
}

export interface SessionHistoryResponse {
  messages: ChatMessage[];
}
