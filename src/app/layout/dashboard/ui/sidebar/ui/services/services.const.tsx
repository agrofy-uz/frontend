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
  priceRangeSom: [0, 10_000_000],
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

export const SERVICES_FILTER_QUERY_KEYS = Object.values(SERVICES_FILTER_QUERY);

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
