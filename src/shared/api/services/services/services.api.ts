import API from '../../api.interface';
import type {
  DistrictDto,
  PremiumServiceDto,
  RegularServiceDto,
  RegionDto,
  ServiceDetailDto,
  ServiceReactionsDto,
  ServiceCategoryDto,
} from './services.types';

/** API `images[]` yoki (legacy) bitta `imageUrl` */
type ServiceImagesApiRow = {
  images?: string[];
  imageUrl?: string;
};

function normalizeServiceImages(row: ServiceImagesApiRow): string[] {
  if (Array.isArray(row.images) && row.images.length > 0) {
    return row.images.filter((u) => typeof u === 'string' && u.trim() !== '');
  }
  if (typeof row.imageUrl === 'string' && row.imageUrl.trim()) {
    return [row.imageUrl.trim()];
  }
  return [];
}

/** GET /api/services/:id */
export const getServiceById = async (
  id: string
): Promise<ServiceDetailDto | null> => {
  if (!id.trim()) return null;
  const response = await API.get<Omit<ServiceDetailDto, 'images'> & ServiceImagesApiRow>(
    `/services/${id}`
  );
  const data = response.data;
  if (!data || typeof data !== 'object') return null;
  const { imageUrl, images, ...rest } = data;
  return {
    ...rest,
    images: normalizeServiceImages({ images, imageUrl }),
  };
};

/**
 * GET /api/services/categories
 * (VITE_API_BASE_URL oxirida /api bo‘lsin, masalan http://localhost:5167/api)
 */
export const getServicesCategories = async (): Promise<
  ServiceCategoryDto[]
> => {
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
  regionId: string
): Promise<DistrictDto[]> => {
  const response = await API.get<DistrictDto[]>('/districts', {
    params: { regionId },
  });
  const { data } = response;
  return Array.isArray(data) ? data : [];
};

/** GET /api/services/premium */
export const getPremiumServices = async (): Promise<PremiumServiceDto[]> => {
  const response =
    await API.get<(Omit<PremiumServiceDto, 'images'> & ServiceImagesApiRow)[]>(
      '/services/premium'
    );
  const { data } = response;
  if (!Array.isArray(data)) return [];
  return data.map(({ imageUrl, images, ...rest }) => ({
    ...rest,
    images: normalizeServiceImages({ images, imageUrl }),
  }));
};

/** GET /api/services/regular */
export const getRegularServices = async (): Promise<RegularServiceDto[]> => {
  const response =
    await API.get<(Omit<RegularServiceDto, 'images'> & ServiceImagesApiRow)[]>(
      '/services/regular'
    );
  const { data } = response;
  if (!Array.isArray(data)) return [];
  return data.map(({ imageUrl, images, ...rest }) => ({
    ...rest,
    images: normalizeServiceImages({ images, imageUrl }),
  }));
};

/** GET /api/reactions/:itemId */
export const getServiceReactions = async (
  itemId: string
): Promise<ServiceReactionsDto | null> => {
  if (!itemId.trim()) return null;
  const response = await API.get<ServiceReactionsDto>(`/reactions/${itemId}`);
  const data = response.data;
  if (!data || typeof data !== 'object') return null;
  return data;
};

/** POST /api/reactions/:itemId/like */
export const likeService = async (itemId: string): Promise<void> => {
  if (!itemId.trim()) return;
  await API.post(`/reactions/${itemId}/like`);
};

/** POST /api/reactions/:itemId/dislike */
export const dislikeService = async (itemId: string): Promise<void> => {
  if (!itemId.trim()) return;
  await API.post(`/reactions/${itemId}/dislike`);
};
