/** GET /api/market/categories */
export type MarketCategoryDto = {
  id: string;
  name: string;
  icon: string;
  count: number;
};

/** GET /api/market/premium */
export type PremiumMarketDto = {
  id: string;
  title: string;
  description?: string;
  regions?: string;
  districts?: string;
  /** Bitta narx (so‘m) */
  price: number;
  images: string[];
  premium: boolean;
  phone: string;
  rating?: string;
};

/** GET /api/market/regular */
export type RegularMarketDto = {
  id: string;
  title: string;
  description?: string;
  regions?: string;
  districts?: string;
  price: number;
  images: string[];
  rating?: string;
  premium: boolean;
  phone: string;
};

/** GET /api/market — bitta ro‘yxat (premium / oddiy) */
export type MarketListItemDto = RegularMarketDto & {
  categoryId?: string;
  category?: string;
};

/** GET /api/market — tartiblash qiymatlari */
export type MarketListSort = 'newest' | 'priceAsc' | 'priceDesc' | 'ratingDesc';

/** GET /api/market — query (barcha parametrlar ixtiyoriy) */
export type MarketListQueryParams = {
  search?: string;
  categoryId?: string;
  regionId?: string;
  districtId?: string;
  priceFrom?: number;
  priceTo?: number;
  minRating?: number;
  sort?: MarketListSort;
  page?: number;
  pageSize?: number;
};

/** GET /api/market — sahifalangan javob */
export type MarketListPageDto = {
  items: MarketListItemDto[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

/** GET /api/market/suggest */
export type MarketSuggestItemDto = {
  name: string;
};

/** GET /api/regions */
export type RegionDto = {
  id: string;
  name: string;
};

/** GET /api/districts?regionId=… */
export type DistrictDto = {
  id: string;
  name: string;
};

/** GET /api/market/:id */
export type MarketDetailDto = {
  id: string;
  title: string;
  regions: string;
  districts: string;
  price: number;
  images: string[];
  premium: boolean;
  phone: string;
  description: string;
  telegram: string;
  instagram: string;
  category: string;
};

/** GET /api/reactions/:itemId */
export type MarketReactionsDto = {
  itemId: string;
  likes: number;
  dislikes: number;
  rating: number;
  myReaction: 'like' | 'dislike' | null;
};
