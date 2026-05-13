import type { MyProductDto, MyServiceDto } from './my-ads.types';
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

type MyListingApiRow = Omit<MyServiceDto, 'images'> &
  ServiceImagesApiRow & {
    region?: string;
    district?: string;
  };

function mapMyListingRows(data: MyListingApiRow[]): MyServiceDto[] {
  return data.map(({ imageUrl, images, region, district, ...rest }) => ({
    ...rest,
    regions: rest.regions ?? region,
    districts: rest.districts ?? district,
    images: normalizeServiceImages({ images, imageUrl }),
  }));
}

/** GET /api/my-services */
export const getMyServices = async (): Promise<MyServiceDto[]> => {
  const response = await API.get<MyListingApiRow[]>('/my-services');
  const { data } = response;
  if (!Array.isArray(data)) return [];
  return mapMyListingRows(data);
};

/** GET /api/my-products */
export const getMyProducts = async (): Promise<MyProductDto[]> => {
  const response = await API.get<MyListingApiRow[]>('/my-products');
  const { data } = response;
  if (!Array.isArray(data)) return [];
  return mapMyListingRows(data);
};

/** DELETE /api/my-services/:id */
export const deleteMyService = async (id: string): Promise<void> => {
  await API.delete(`/my-services/${id}`);
};

/** DELETE /api/my-products/:id */
export const deleteMyProduct = async (id: string): Promise<void> => {
  await API.delete(`/my-products/${id}`);
};

/** POST /api/my-services (multipart/form-data) */
export const createMyService = async (formData: FormData): Promise<void> => {
  await API.post('/my-services', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/** POST /api/my-products (multipart/form-data) */
export const createMyProduct = async (formData: FormData): Promise<void> => {
  await API.post('/my-products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/** PUT /api/my-services/:id (multipart/form-data) */
export const updateMyService = async (
  id: string,
  formData: FormData,
): Promise<void> => {
  await API.put(`/my-services/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

/** PUT /api/my-products/:id (multipart/form-data) */
export const updateMyProduct = async (
  id: string,
  formData: FormData,
): Promise<void> => {
  await API.put(`/my-products/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
