export type ServiceCategoryDto = {
  id: string;
  name: string;
  icon: string;
  count: number;
};

/** GET /api/services/premium */
export type PremiumServiceDto = {
  id: string;
  title: string;
  description?: string;
  regions?: string;
  districts?: string;
  priceFrom: number;
  priceUntil: number;
  images: string[];
  premium: boolean;
  phone: string;
  rating?: string;
};

/** GET /api/services/regular */
export type RegularServiceDto = {
  id: string;
  title: string;
  description?: string;
  regions?: string;
  districts?: string;
  priceFrom: number;
  priceUntil: number;
  images: string[];
  rating?: string;
  premium: boolean;
  phone: string;
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

/** GET /api/services/:id */
export type ServiceDetailDto = {
  id: string;
  title: string;
  regions: string;
  districts: string;
  priceFrom: number;
  priceUntil: number;
  images: string[];
  premium: boolean;
  phone: string;
  description: string;
  telegram: string;
  instagram: string;
  category: string;
};

/** GET /api/reactions/:itemId */
export type ServiceReactionsDto = {
  itemId: string;
  likes: number;
  dislikes: number;
  rating: number;
  myReaction: 'like' | 'dislike' | null;
};
