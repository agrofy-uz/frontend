import API from '../../api.interface';
import type {
  DistrictDto,
  MarketCategoryDto,
  MarketDetailDto,
  MarketListItemDto,
  MarketListPageDto,
  MarketListQueryParams,
  MarketReactionsDto,
  MarketSuggestItemDto,
  PremiumMarketDto,
  RegionDto,
  RegularMarketDto,
} from './market.types';

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

/** API `images[]` yoki (legacy) bitta `imageUrl` */
type MarketImagesApiRow = {
  images?: string[];
  imageUrl?: string;
};

function normalizeMarketImages(row: MarketImagesApiRow): string[] {
  if (Array.isArray(row.images) && row.images.length > 0) {
    return row.images.filter((u) => typeof u === 'string' && u.trim() !== '');
  }
  if (typeof row.imageUrl === 'string' && row.imageUrl.trim()) {
    return [row.imageUrl.trim()];
  }
  return [];
}

/** API `price` yoki (legacy) `priceFrom` / `priceUntil` */
function coerceMarketPriceFromRow(row: Record<string, unknown>): number {
  for (const key of ['price', 'Price'] as const) {
    const raw = row[key];
    if (typeof raw === 'number' && Number.isFinite(raw) && raw > 0) {
      return Math.trunc(raw);
    }
    if (typeof raw === 'string' && raw.trim()) {
      const n = Number(raw.replace(/\s/g, ''));
      if (Number.isFinite(n) && n > 0) return Math.trunc(n);
    }
  }
  const from = Number(row.priceFrom ?? row.PriceFrom ?? 0);
  if (Number.isFinite(from) && from > 0) return Math.trunc(from);
  const until = Number(row.priceUntil ?? row.PriceUntil ?? 0);
  if (Number.isFinite(until) && until > 0) return Math.trunc(until);
  return 0;
}

function stripLegacyPriceFields(rest: Record<string, unknown>): void {
  delete rest.price;
  delete rest.Price;
  delete rest.priceFrom;
  delete rest.priceUntil;
  delete rest.PriceFrom;
  delete rest.PriceUntil;
}

function normalizeMarketListItem(
  row: MarketImagesApiRow & Record<string, unknown>,
): MarketListItemDto {
  const { imageUrl, images, ...raw } = row;
  const price = coerceMarketPriceFromRow(raw);
  const rest = { ...raw };
  stripLegacyPriceFields(rest);
  return {
    ...(rest as Omit<MarketListItemDto, 'images' | 'price'>),
    images: normalizeMarketImages({ images, imageUrl }),
    price,
  };
}

function normalizeMarketsListPageDto(data: unknown): MarketListPageDto {
  const empty: MarketListPageDto = {
    items: [],
    totalCount: 0,
    page: 1,
    pageSize: 0,
    totalPages: 0,
  };

  if (Array.isArray(data)) {
    const items = data.map((row) =>
      normalizeMarketListItem(row as MarketImagesApiRow & Record<string, unknown>),
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
    normalizeMarketListItem(row as MarketImagesApiRow & Record<string, unknown>),
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

/** GET /api/market/:id */
export const getMarketById = async (
  id: string,
): Promise<MarketDetailDto | null> => {
  if (!id.trim()) return null;
  const response = await API.get<MarketImagesApiRow & Record<string, unknown>>(
    `/market/${id}`,
  );
  const data = response.data;
  if (!data || typeof data !== 'object') return null;
  const { imageUrl, images, ...raw } = data;
  const price = coerceMarketPriceFromRow(raw);
  const rest = { ...raw };
  stripLegacyPriceFields(rest);
  return {
    ...(rest as Omit<MarketDetailDto, 'images' | 'price'>),
    images: normalizeMarketImages({ images, imageUrl }),
    price,
  };
};

/** GET /api/market/categories */
export const getMarketCategories = async (): Promise<MarketCategoryDto[]> => {
  const response = await API.get<MarketCategoryDto[]>('/market/categories');
  const { data } = response;
  return Array.isArray(data) ? data : [];
};

/**
 * GET /api/market
 * Barcha filterlar query parametrlarida; sahifalangan javob.
 */
export const getMarkets = async (
  params?: MarketListQueryParams,
): Promise<MarketListPageDto> => {
  const response = await API.get<unknown>('/market', {
    params: params ?? {},
  });
  return normalizeMarketsListPageDto(response.data);
};

/** GET /api/market/suggest?q=… */
export const getMarketSuggest = async (params: {
  q: string;
}): Promise<MarketSuggestItemDto[]> => {
  const response = await API.get<unknown>('/market/suggest', {
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
    .filter((x): x is MarketSuggestItemDto => x !== null);
};

/** GET /api/market/premium */
export const getPremiumMarkets = async (): Promise<PremiumMarketDto[]> => {
  const response =
    await API.get<(MarketImagesApiRow & Record<string, unknown>)[]>(
      '/market/premium',
    );
  const { data } = response;
  if (!Array.isArray(data)) return [];
  return data.map((row) => {
    const { imageUrl, images, ...raw } = row;
    const price = coerceMarketPriceFromRow(raw);
    const rest = { ...raw };
    stripLegacyPriceFields(rest);
    return {
      ...(rest as Omit<PremiumMarketDto, 'images' | 'price'>),
      images: normalizeMarketImages({ images, imageUrl }),
      price,
    };
  });
};

/** GET /api/market/regular */
export const getRegularMarkets = async (): Promise<RegularMarketDto[]> => {
  const response =
    await API.get<(MarketImagesApiRow & Record<string, unknown>)[]>(
      '/market/regular',
    );
  const { data } = response;
  if (!Array.isArray(data)) return [];
  return data.map((row) => {
    const { imageUrl, images, ...raw } = row;
    const price = coerceMarketPriceFromRow(raw);
    const rest = { ...raw };
    stripLegacyPriceFields(rest);
    return {
      ...(rest as Omit<RegularMarketDto, 'images' | 'price'>),
      images: normalizeMarketImages({ images, imageUrl }),
      price,
    };
  });
};

/** GET /api/reactions/:itemId (mahsulot ham shu endpointdan foydalanishi mumkin) */
export const getMarketReactions = async (
  itemId: string,
): Promise<MarketReactionsDto | null> => {
  if (!itemId.trim()) return null;
  const response = await API.get<MarketReactionsDto>(`/reactions/${itemId}`);
  const data = response.data;
  if (!data || typeof data !== 'object') return null;
  return data;
};

/** POST /api/reactions/:itemId/like */
export const likeMarket = async (itemId: string): Promise<void> => {
  if (!itemId.trim()) return;
  await API.post(`/reactions/${itemId}/like`);
};

/** POST /api/reactions/:itemId/dislike */
export const dislikeMarket = async (itemId: string): Promise<void> => {
  if (!itemId.trim()) return;
  await API.post(`/reactions/${itemId}/dislike`);
};
