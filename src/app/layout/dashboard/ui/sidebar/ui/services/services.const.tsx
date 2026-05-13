import type { ServicesListQueryParams, ServicesListSort } from '@/shared/api/services/services';

/** Kengaytirilgan filter holati (keyinchalik API / URL bilan sinxronlash mumkin) */
export type ServicesFilterValues = {
  /** Narx oralig‘i, so‘m (API / filtrlash uchun aniq qiymat) */
  priceRangeSom: [number, number];
  regionId: string | null;
  districtId: string | null;
  /** 0 = cheklov yo‘q, 1–5 = minimal yulduz */
  minRating: number;
};

export const DEFAULT_SERVICES_FILTER_VALUES: ServicesFilterValues = {
  priceRangeSom: [0, 3_000_000],
  regionId: null,
  districtId: null,
  minRating: 0,
};

/** `/dashboard/services` query: kengaytirilgan filter */
export const SERVICES_FILTER_QUERY = {
  priceMin: 'narx_min',
  priceMax: 'narx_max',
  viloyat: 'viloyat',
  tuman: 'tuman',
  reyting: 'reyting',
} as const;

/** Turkum (kategoriya) identifikatori */
export const SERVICES_CATEGORY_QUERY_KEY = 'turkum';

export const SERVICES_FILTER_QUERY_KEYS = Object.values(SERVICES_FILTER_QUERY);

/** Header qidiruv matni (`?q=`) — API da `search` */
export const SERVICES_SEARCH_QUERY_KEY = 'q';

/**
 * UI: «Qidiruv» chip faqat Enter bilan commit qilinganda (`?q_enter=1`).
 * Suggest tanlashda `q` yoziladi, lekin bu kalit o‘chiriladi.
 */
export const SERVICES_SEARCH_ENTER_CHIP_QUERY_KEY = 'q_enter';

/** `/services/suggest` — minimal belgilar soni */
export const SERVICES_SUGGEST_MIN_QUERY_LENGTH = 3;

/** Sahifa tartibi va paginatsiya (`?sort=&page=&pageSize=`) */
export const SERVICES_SORT_QUERY_KEY = 'sort';
export const SERVICES_PAGE_QUERY_KEY = 'page';
export const SERVICES_PAGE_SIZE_QUERY_KEY = 'pageSize';

export const DEFAULT_SERVICES_SORT: ServicesListSort = 'newest';
export const DEFAULT_SERVICES_PAGE = 1;
export const DEFAULT_SERVICES_PAGE_SIZE = 20;
export const MAX_SERVICES_PAGE_SIZE = 100;

const SERVICES_SORT_VALUES: readonly ServicesListSort[] = [
  'newest',
  'priceAsc',
  'priceDesc',
  'ratingDesc',
];

export function isServicesListSort(value: string | null): value is ServicesListSort {
  return (
    value !== null &&
    (SERVICES_SORT_VALUES as readonly string[]).includes(value)
  );
}

export function parseServicesPageFromSearchParams(
  params: URLSearchParams,
): number {
  const raw = params.get(SERVICES_PAGE_QUERY_KEY);
  const n = raw !== null ? Number.parseInt(raw, 10) : Number.NaN;
  if (Number.isFinite(n) && n >= 1) return n;
  return DEFAULT_SERVICES_PAGE;
}

export function parseServicesPageSizeFromSearchParams(
  params: URLSearchParams,
): number {
  const raw = params.get(SERVICES_PAGE_SIZE_QUERY_KEY);
  const n = raw !== null ? Number.parseInt(raw, 10) : Number.NaN;
  if (Number.isFinite(n) && n >= 1) {
    return Math.min(MAX_SERVICES_PAGE_SIZE, n);
  }
  return DEFAULT_SERVICES_PAGE_SIZE;
}

export function parseServicesSortFromSearchParams(
  params: URLSearchParams,
): ServicesListSort {
  const raw = params.get(SERVICES_SORT_QUERY_KEY);
  return isServicesListSort(raw) ? raw : DEFAULT_SERVICES_SORT;
}

export const SERVICES_LIST_META_QUERY_KEYS = [
  SERVICES_SORT_QUERY_KEY,
  SERVICES_PAGE_QUERY_KEY,
  SERVICES_PAGE_SIZE_QUERY_KEY,
] as const;

/** URL (`q`, `turkum`, `narx_*`, …) → GET /api/services query */
export function buildServicesListApiParamsFromSearchParams(
  searchParams: URLSearchParams,
): ServicesListQueryParams {
  const filter = parseServicesFilterFromSearchParams(searchParams);
  const search = (searchParams.get(SERVICES_SEARCH_QUERY_KEY) ?? '').trim();
  const categoryId = (searchParams.get(SERVICES_CATEGORY_QUERY_KEY) ?? '').trim();

  const sort = parseServicesSortFromSearchParams(searchParams);

  const params: ServicesListQueryParams = {
    // Hozircha backendga yubormaymiz:
    // page,
    // pageSize,
    sort,
  };

  if (search) params.search = search;
  if (categoryId) params.categoryId = categoryId;

  const [pMin, pMax] = filter.priceRangeSom;
  const d = DEFAULT_SERVICES_FILTER_VALUES.priceRangeSom;
  if (pMin !== d[0] || pMax !== d[1]) {
    params.priceFrom = pMin;
    params.priceTo = pMax;
  }

  if (filter.regionId) params.regionId = filter.regionId;
  if (filter.districtId) params.districtId = filter.districtId;
  if (filter.minRating > 0) params.minRating = filter.minRating;

  return params;
}

/** GET /api/services/suggest — faqat `q` (boshqa URL filtrlari yuborilmaydi) */
export function buildServicesSuggestApiParamsFromSearchParams(
  searchParams: URLSearchParams,
): { q: string } {
  const q = (searchParams.get(SERVICES_SEARCH_QUERY_KEY) ?? '').trim();
  return { q };
}

export function mergeServicesSearchParams(
  current: URLSearchParams,
  query: string,
  options?: { searchChipFromEnter?: boolean },
): URLSearchParams {
  const out = new URLSearchParams(current);
  const t = query.trim();
  if (t) {
    out.set(SERVICES_SEARCH_QUERY_KEY, t);
    if (options?.searchChipFromEnter === true) {
      out.set(SERVICES_SEARCH_ENTER_CHIP_QUERY_KEY, '1');
    } else {
      out.delete(SERVICES_SEARCH_ENTER_CHIP_QUERY_KEY);
    }
  } else {
    out.delete(SERVICES_SEARCH_QUERY_KEY);
    out.delete(SERVICES_SEARCH_ENTER_CHIP_QUERY_KEY);
  }
  return out;
}

export function parseServicesFilterFromSearchParams(
  params: URLSearchParams
): ServicesFilterValues {
  const next: ServicesFilterValues = {
    ...DEFAULT_SERVICES_FILTER_VALUES,
  };

  const minStr = params.get(SERVICES_FILTER_QUERY.priceMin);
  const maxStr = params.get(SERVICES_FILTER_QUERY.priceMax);
  if (minStr !== null && maxStr !== null) {
    const lo = Number(minStr);
    const hi = Number(maxStr);
    if (Number.isFinite(lo) && Number.isFinite(hi)) {
      next.priceRangeSom = [Math.max(0, lo), Math.max(lo, hi)];
    }
  }

  const vil = params.get(SERVICES_FILTER_QUERY.viloyat);
  if (vil) next.regionId = vil;

  const tum = params.get(SERVICES_FILTER_QUERY.tuman);
  if (tum) next.districtId = tum;

  const reytingStr = params.get(SERVICES_FILTER_QUERY.reyting);
  if (reytingStr !== null) {
    const r = Number(reytingStr);
    if (Number.isFinite(r)) {
      next.minRating = Math.min(5, Math.max(0, Math.floor(r)));
    }
  }

  return next;
}

/** `turkum` va boshqa kalitlarni saqlab, faqat filter query qismini yangilaydi */
export function mergeServicesFilterIntoSearchParams(
  current: URLSearchParams,
  filter: ServicesFilterValues
): URLSearchParams {
  const out = new URLSearchParams(current);
  for (const k of SERVICES_FILTER_QUERY_KEYS) {
    out.delete(k);
  }

  const d = DEFAULT_SERVICES_FILTER_VALUES;
  const [pMin, pMax] = filter.priceRangeSom;
  if (pMin !== d.priceRangeSom[0] || pMax !== d.priceRangeSom[1]) {
    out.set(SERVICES_FILTER_QUERY.priceMin, String(pMin));
    out.set(SERVICES_FILTER_QUERY.priceMax, String(pMax));
  }
  if (filter.regionId) {
    out.set(SERVICES_FILTER_QUERY.viloyat, filter.regionId);
  }
  if (filter.districtId) {
    out.set(SERVICES_FILTER_QUERY.tuman, filter.districtId);
  }
  if (filter.minRating > 0) {
    out.set(SERVICES_FILTER_QUERY.reyting, String(filter.minRating));
  }
  return out;
}
