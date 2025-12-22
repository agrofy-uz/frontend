// API base configuration
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// API interface va types
export * from './api.interface';
export * from './api.types';
