import api from '../../api.interface';
import type { ServiceCategoryDto } from './services.types';

/**
 * Backend: GET /api/services/categories
 * (masalan http://localhost:5167/api/services/categories — VITE_API_BASE_URL oxirida /api bo‘lsin)
 */
export const servicesApi = {
  getCategories: async (): Promise<ServiceCategoryDto[]> => {
    const { data } = await api.get<unknown>('/services/categories');
    return Array.isArray(data) ? (data as ServiceCategoryDto[]) : [];
  },
};
