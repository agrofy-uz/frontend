import type {
  MarketListQueryParams,
  MarketListSort,
} from '@/shared/api/services/market';

/** Kengaytirilgan filter holati (keyinchalik API / URL bilan sinxronlash mumkin) */
export type MarketFilterValues = {
  /** Narx oralig‘i, so‘m (API / filtrlash uchun aniq qiymat) */
  priceRangeSom: [number, number];
  regionId: string | null;
  districtId: string | null;
  /** 0 = cheklov yo‘q, 1–5 = minimal yulduz */
  minRating: number;
};

export const DEFAULT_MARKET_FILTER_VALUES: MarketFilterValues = {
  priceRangeSom: [0, 3_000_000],
  regionId: null,
  districtId: null,
  minRating: 0,
};

/** `/dashboard/market` query: kengaytirilgan filter */
export const MARKET_FILTER_QUERY = {
  priceMin: 'narx_min',
  priceMax: 'narx_max',
  viloyat: 'viloyat',
  tuman: 'tuman',
  reyting: 'reyting',
} as const;

/** Turkum (kategoriya) identifikatori */
export const MARKET_CATEGORY_QUERY_KEY = 'turkum';

export const MARKET_FILTER_QUERY_KEYS = Object.values(MARKET_FILTER_QUERY);

/** Header qidiruv matni (`?q=`) — API da `search` */
export const MARKET_SEARCH_QUERY_KEY = 'q';

/**
 * UI: «Qidiruv» chip faqat Enter bilan commit qilinganda (`?q_enter=1`).
 * Suggest tanlashda `q` yoziladi, lekin bu kalit o‘chiriladi.
 */
export const MARKET_SEARCH_ENTER_CHIP_QUERY_KEY = 'q_enter';

/** `/market` suggest — minimal belgilar soni (mahsulotlar ro‘yxati qo‘shilganda) */
export const MARKET_SUGGEST_MIN_QUERY_LENGTH = 3;

/** Sahifa tartibi va paginatsiya (`?sort=&page=&pageSize=`) */
export const MARKET_SORT_QUERY_KEY = 'sort';
export const MARKET_PAGE_QUERY_KEY = 'page';
export const MARKET_PAGE_SIZE_QUERY_KEY = 'pageSize';

export const DEFAULT_MARKET_SORT: MarketListSort = 'newest';
export const DEFAULT_MARKET_PAGE = 1;
export const DEFAULT_MARKET_PAGE_SIZE = 20;
export const MAX_MARKET_PAGE_SIZE = 100;

const MARKET_SORT_VALUES: readonly MarketListSort[] = [
  'newest',
  'priceAsc',
  'priceDesc',
  'ratingDesc',
];

export function isMarketListSort(value: string | null): value is MarketListSort {
  return (
    value !== null &&
    (MARKET_SORT_VALUES as readonly string[]).includes(value)
  );
}

export function parseMarketPageFromSearchParams(
  params: URLSearchParams,
): number {
  const raw = params.get(MARKET_PAGE_QUERY_KEY);
  const n = raw !== null ? Number.parseInt(raw, 10) : Number.NaN;
  if (Number.isFinite(n) && n >= 1) return n;
  return DEFAULT_MARKET_PAGE;
}

export function parseMarketPageSizeFromSearchParams(
  params: URLSearchParams,
): number {
  const raw = params.get(MARKET_PAGE_SIZE_QUERY_KEY);
  const n = raw !== null ? Number.parseInt(raw, 10) : Number.NaN;
  if (Number.isFinite(n) && n >= 1) {
    return Math.min(MAX_MARKET_PAGE_SIZE, n);
  }
  return DEFAULT_MARKET_PAGE_SIZE;
}

export function parseMarketSortFromSearchParams(
  params: URLSearchParams,
): MarketListSort {
  const raw = params.get(MARKET_SORT_QUERY_KEY);
  return isMarketListSort(raw) ? raw : DEFAULT_MARKET_SORT;
}

export const MARKET_LIST_META_QUERY_KEYS = [
  MARKET_SORT_QUERY_KEY,
  MARKET_PAGE_QUERY_KEY,
  MARKET_PAGE_SIZE_QUERY_KEY,
] as const;

/** URL (`q`, `turkum`, `narx_*`, …) → keyinchalik GET mahsulotlar API query */
export function buildMarketListApiParamsFromSearchParams(
  searchParams: URLSearchParams,
): MarketListQueryParams {
  const filter = parseMarketFilterFromSearchParams(searchParams);
  const search = (searchParams.get(MARKET_SEARCH_QUERY_KEY) ?? '').trim();
  const categoryId = (searchParams.get(MARKET_CATEGORY_QUERY_KEY) ?? '').trim();

  const sort = parseMarketSortFromSearchParams(searchParams);

  const params: MarketListQueryParams = {
    // Hozircha backendga yubormaymiz:
    // page,
    // pageSize,
    sort,
  };

  if (search) params.search = search;
  if (categoryId) params.categoryId = categoryId;

  const [pMin, pMax] = filter.priceRangeSom;
  const d = DEFAULT_MARKET_FILTER_VALUES.priceRangeSom;
  if (pMin !== d[0] || pMax !== d[1]) {
    params.priceFrom = pMin;
    params.priceTo = pMax;
  }

  if (filter.regionId) params.regionId = filter.regionId;
  if (filter.districtId) params.districtId = filter.districtId;
  if (filter.minRating > 0) params.minRating = filter.minRating;

  return params;
}

/** GET mahsulotlar suggest — faqat `q` (keyinchalik API bilan bog‘lanadi) */
export function buildMarketSuggestApiParamsFromSearchParams(
  searchParams: URLSearchParams,
): { q: string } {
  const q = (searchParams.get(MARKET_SEARCH_QUERY_KEY) ?? '').trim();
  return { q };
}

export function mergeMarketSearchParams(
  current: URLSearchParams,
  query: string,
  options?: { searchChipFromEnter?: boolean },
): URLSearchParams {
  const out = new URLSearchParams(current);
  const t = query.trim();
  if (t) {
    out.set(MARKET_SEARCH_QUERY_KEY, t);
    if (options?.searchChipFromEnter === true) {
      out.set(MARKET_SEARCH_ENTER_CHIP_QUERY_KEY, '1');
    } else {
      out.delete(MARKET_SEARCH_ENTER_CHIP_QUERY_KEY);
    }
  } else {
    out.delete(MARKET_SEARCH_QUERY_KEY);
    out.delete(MARKET_SEARCH_ENTER_CHIP_QUERY_KEY);
  }
  return out;
}

export function parseMarketFilterFromSearchParams(
  params: URLSearchParams
): MarketFilterValues {
  const next: MarketFilterValues = {
    ...DEFAULT_MARKET_FILTER_VALUES,
  };

  const minStr = params.get(MARKET_FILTER_QUERY.priceMin);
  const maxStr = params.get(MARKET_FILTER_QUERY.priceMax);
  if (minStr !== null && maxStr !== null) {
    const lo = Number(minStr);
    const hi = Number(maxStr);
    if (Number.isFinite(lo) && Number.isFinite(hi)) {
      next.priceRangeSom = [Math.max(0, lo), Math.max(lo, hi)];
    }
  }

  const vil = params.get(MARKET_FILTER_QUERY.viloyat);
  if (vil) next.regionId = vil;

  const tum = params.get(MARKET_FILTER_QUERY.tuman);
  if (tum) next.districtId = tum;

  const reytingStr = params.get(MARKET_FILTER_QUERY.reyting);
  if (reytingStr !== null) {
    const r = Number(reytingStr);
    if (Number.isFinite(r)) {
      next.minRating = Math.min(5, Math.max(0, Math.floor(r)));
    }
  }

  return next;
}

/** `turkum` va boshqa kalitlarni saqlab, faqat filter query qismini yangilaydi */
export function mergeMarketFilterIntoSearchParams(
  current: URLSearchParams,
  filter: MarketFilterValues
): URLSearchParams {
  const out = new URLSearchParams(current);
  for (const k of MARKET_FILTER_QUERY_KEYS) {
    out.delete(k);
  }

  const d = DEFAULT_MARKET_FILTER_VALUES;
  const [pMin, pMax] = filter.priceRangeSom;
  if (pMin !== d.priceRangeSom[0] || pMax !== d.priceRangeSom[1]) {
    out.set(MARKET_FILTER_QUERY.priceMin, String(pMin));
    out.set(MARKET_FILTER_QUERY.priceMax, String(pMax));
  }
  if (filter.regionId) {
    out.set(MARKET_FILTER_QUERY.viloyat, filter.regionId);
  }
  if (filter.districtId) {
    out.set(MARKET_FILTER_QUERY.tuman, filter.districtId);
  }
  if (filter.minRating > 0) {
    out.set(MARKET_FILTER_QUERY.reyting, String(filter.minRating));
  }
  return out;
}
