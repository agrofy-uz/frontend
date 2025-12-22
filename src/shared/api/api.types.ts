// API response types
export type ApiResponse<T> = {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: T;
  data?: T;
  message?: string;
  success?: boolean;
};

// API params
export type ApiParams = {
  limit?: number;
  offset?: number;
  page?: number;
  search?: string;
  [key: string]: unknown;
};
