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

/** GET /api/my-services */
export const getMyServices = async (): Promise<MyServiceDto[]> => {
  const response =
    await API.get<(Omit<MyServiceDto, 'images'> & ServiceImagesApiRow)[]>(
      '/my-services'
    );
  const { data } = response;
  if (!Array.isArray(data)) return [];
  return data.map(({ imageUrl, images, ...rest }) => ({
    ...rest,
    images: normalizeServiceImages({ images, imageUrl }),
  }));
};

/** DELETE /api/my-services/:id */
export const deleteMyService = async (id: string): Promise<void> => {
  await API.delete(`/my-services/${id}`);
};
