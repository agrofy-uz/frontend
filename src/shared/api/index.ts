export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export { default as api } from './api.interface';
export * from './api.types';
export * from './services/auth';
export * from './services/ai';
