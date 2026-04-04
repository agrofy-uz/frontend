import API from '../../api.interface';
import type {
  DistrictDto,
  RegionDto,
  ServiceCategoryDto,
} from './services.types';

/**
 * GET /api/services/categories
 * (VITE_API_BASE_URL oxirida /api bo‘lsin, masalan http://localhost:5167/api)
 */
export const getServicesCategories = async (): Promise<ServiceCategoryDto[]> => {
  const response = await API.get<ServiceCategoryDto[]>('/services/categories');
  const { data } = response;
  return Array.isArray(data) ? data : [];
};

/** GET /api/regions */
export const getRegions = async (): Promise<RegionDto[]> => {
  const response = await API.get<RegionDto[]>('/regions');
  const { data } = response;
  return Array.isArray(data) ? data : [];
};

/** GET /api/districts?regionId=… */
export const getDistricts = async (
  regionId: string,
): Promise<DistrictDto[]> => {
  const response = await API.get<DistrictDto[]>('/districts', {
    params: { regionId },
  });
  const { data } = response;
  return Array.isArray(data) ? data : [];
};
