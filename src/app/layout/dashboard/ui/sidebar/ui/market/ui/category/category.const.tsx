import type { MarketCategoryDto } from '@/shared/api/services/market';

/** Sidebar turkumi — mahsulotlar API DTO */
export type MarketSidebarCategory = MarketCategoryDto;

export const MARKET_CATEGORY_ROW_PX = 44;
export const MARKET_CATEGORY_GAP_PX = 4;
export const MARKET_CATEGORY_ROWS_COLLAPSED = 6;
export const MARKET_CATEGORY_EXPAND_EXTRA_ROWS = 4;
export const MARKET_CATEGORY_TOGGLE_RESERVE_PX = 40;

export function getMarketCategoryListHeightPx(rowCount: number): number {
  if (rowCount <= 0) return 0;
  return (
    rowCount * MARKET_CATEGORY_ROW_PX +
    Math.max(0, rowCount - 1) * MARKET_CATEGORY_GAP_PX
  );
}
