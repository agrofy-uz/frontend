import type { MyServiceDto } from './my-ads.types';
import API from '../../api.interface';

type ServiceImagesApiRow = {
  images?: string[];
  imageUrl?: string;
};

function normalizeServiceImages(row: ServiceImagesApiRow): string[] {
  if (!row.images && !row.imageUrl) return [];
  if (row.images) return row.images;
  return [row.imageUrl ?? ''];
}

type MyServiceApiRow = Omit<MyServiceDto, 'images'> &
  ServiceImagesApiRow & {
    region?: string;
    district?: string;
  };

/** GET /api/my-services */
export const getMyServices = async (): Promise<MyServiceDto[]> => {
  const response = await API.get<MyServiceApiRow[]>('/my-services');
  const { data } = response;
  if (!Array.isArray(data)) return [];
  return data.map(
    ({ imageUrl, images, region, district, ...rest }) => ({
      ...rest,
      regions: rest.regions ?? region,
      districts: rest.districts ?? district,
      images: normalizeServiceImages({ images, imageUrl }),
    })
  );
};

/** DELETE /api/my-services/:id */
export const deleteMyService = async (id: string): Promise<void> => {
  await API.delete(`/my-services/${id}`);
};

/** POST /api/my-services (multipart/form-data) */
export const createMyService = async (formData: FormData): Promise<void> => {
  await API.post('/my-services', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/** PUT /api/my-services/:id (multipart/form-data) */
export const updateMyService = async (
  id: string,
  formData: FormData
): Promise<void> => {
  await API.put(`/my-services/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
