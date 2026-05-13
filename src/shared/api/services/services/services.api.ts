import API from '../../api.interface';
import type {
  DistrictDto,
  PremiumServiceDto,
  RegularServiceDto,
  RegionDto,
  ServiceDetailDto,
  ServiceReactionsDto,
  ServiceCategoryDto,
  ServiceListItemDto,
  ServiceSuggestItemDto,
  ServicesListPageDto,
  ServicesListQueryParams,
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

function normalizeServiceListItem(
  row: Omit<ServiceListItemDto, 'images'> & ServiceImagesApiRow,
): ServiceListItemDto {
  const { imageUrl, images, ...rest } = row;
  return {
    ...rest,
    images: normalizeServiceImages({ images, imageUrl }),
  };
}

function normalizeServicesListPageDto(data: unknown): ServicesListPageDto {
  const empty: ServicesListPageDto = {
    items: [],
    totalCount: 0,
    page: 1,
    pageSize: 0,
    totalPages: 0,
  };

  if (Array.isArray(data)) {
    const items = data.map((row) =>
      normalizeServiceListItem(
        row as Omit<ServiceListItemDto, 'images'> & ServiceImagesApiRow,
      ),
    );
    const n = items.length;
    return {
      items,
      totalCount: n,
      page: 1,
      pageSize: n,
      totalPages: n > 0 ? 1 : 0,
    };
  }

  if (!data || typeof data !== 'object') return empty;

  const o = data as Record<string, unknown>;
  const rawItems = o.items ?? o.data;
  const arr = Array.isArray(rawItems) ? rawItems : [];
  const items = arr.map((row) =>
    normalizeServiceListItem(
      row as Omit<ServiceListItemDto, 'images'> & ServiceImagesApiRow,
    ),
  );

  const totalCount = Number(o.totalCount ?? o.total ?? items.length);
  const page = Number(o.page ?? 1);
  const pageSize = Number(o.pageSize ?? o.page_size ?? items.length);
  const totalPages = Number(
    o.totalPages ??
      o.total_pages ??
      (pageSize > 0 ? Math.ceil(totalCount / pageSize) : 0),
  );

  return {
    items,
    totalCount: Number.isFinite(totalCount) ? totalCount : items.length,
    page: Number.isFinite(page) && page >= 1 ? page : 1,
    pageSize: Number.isFinite(pageSize) && pageSize >= 0 ? pageSize : items.length,
    totalPages: Number.isFinite(totalPages) ? Math.max(0, totalPages) : 0,
  };
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

/**
 * GET /api/services
 * Barcha filterlar query parametrlarida; sahifalangan javob.
 */
export const getServices = async (
  params?: ServicesListQueryParams,
): Promise<ServicesListPageDto> => {
  const response = await API.get<unknown>('/services', {
    params: params ?? {},
  });
  return normalizeServicesListPageDto(response.data);
};

/** GET /api/services/suggest?q=… (faqat yozilayotgan matn) */
export const getServicesSuggest = async (params: {
  q: string;
}): Promise<ServiceSuggestItemDto[]> => {
  const response = await API.get<unknown>('/services/suggest', {
    params: { q: params.q },
  });
  const { data } = response;
  if (!Array.isArray(data)) return [];
  return data
    .map((row) => {
      if (!row || typeof row !== 'object') return null;
      const name = (row as Record<string, unknown>).name;
      if (typeof name !== 'string' || !name.trim()) return null;
      return { name: name.trim() };
    })
    .filter((x): x is ServiceSuggestItemDto => x !== null);
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
