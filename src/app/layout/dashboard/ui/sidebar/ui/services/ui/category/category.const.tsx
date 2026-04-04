import type { ServiceCategoryDto } from '@/shared/api/services/services';

/** Sidebar turkumi — backend DTO bilan bir xil */
export type ServiceSidebarCategory = ServiceCategoryDto;

/** Bir qatorda taxminiy balandlik (NavLink root) */
export const SERVICE_CATEGORY_ROW_PX = 44;
export const SERVICE_CATEGORY_GAP_PX = 4;

/** Boshlang‘ich ko‘rinadigan qatorlar soni */
export const SERVICE_CATEGORY_ROWS_COLLAPSED = 6;

/** «Ko‘proq» bir marta bosilganda qo‘shiladigan qatorlar (maksimum; joy yetmasa kamayadi) */
export const SERVICE_CATEGORY_EXPAND_EXTRA_ROWS = 4;

/** Turkumlar ostidagi chevron qatori uchun zaxira (px) */
export const SERVICE_CATEGORY_TOGGLE_RESERVE_PX = 40;
export function getCategoryListHeightPx(rowCount: number): number {
  if (rowCount <= 0) return 0;
  return (
    rowCount * SERVICE_CATEGORY_ROW_PX +
    Math.max(0, rowCount - 1) * SERVICE_CATEGORY_GAP_PX
  );
}
