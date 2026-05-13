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

type MyServiceApiRow = Omit<MyServiceDto, 'images'> &
  ServiceImagesApiRow & {
    region?: string;
    district?: string;
  };

function mapMyServiceRows(data: MyServiceApiRow[]): MyServiceDto[] {
  return data.map(({ imageUrl, images, region, district, ...rest }) => ({
    ...rest,
    regions: rest.regions ?? region,
    districts: rest.districts ?? district,
    images: normalizeServiceImages({ images, imageUrl }),
  }));
}

type MyProductApiRow = Omit<MyProductDto, 'images' | 'price'> &
  ServiceImagesApiRow & {
    region?: string;
    district?: string;
    priceFrom?: number;
    priceUntil?: number;
    price?: number;
  };

function coerceProductPrice(row: MyProductApiRow): number {
  if (typeof row.price === 'number' && Number.isFinite(row.price) && row.price > 0) {
    return Math.trunc(row.price);
  }
  if (typeof row.priceFrom === 'number' && row.priceFrom > 0) {
    return Math.trunc(row.priceFrom);
  }
  if (typeof row.priceUntil === 'number' && row.priceUntil > 0) {
    return Math.trunc(row.priceUntil);
  }
  return 0;
}

function mapMyProductRows(data: MyProductApiRow[]): MyProductDto[] {
  return data.map((row) => {
    const {
      imageUrl,
      images,
      region,
      district,
      priceFrom,
      priceUntil,
      price,
      ...entity
    } = row;
    void priceFrom;
    void priceUntil;
    void price;
    return {
      ...entity,
      price: coerceProductPrice(row),
      regions: row.regions ?? region,
      districts: row.districts ?? district,
      images: normalizeServiceImages({ images, imageUrl }),
    };
  });
}

/** GET /api/my-services */
export const getMyServices = async (): Promise<MyServiceDto[]> => {
  const response = await API.get<MyServiceApiRow[]>('/my-services');
  const { data } = response;
  if (!Array.isArray(data)) return [];
  return mapMyServiceRows(data);
};

/** GET /api/my-products */
export const getMyProducts = async (): Promise<MyProductDto[]> => {
  const response = await API.get<MyProductApiRow[]>('/my-products');
  const { data } = response;
  if (!Array.isArray(data)) return [];
  return mapMyProductRows(data);
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
