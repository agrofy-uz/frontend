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
  description: string;
  priceFrom: number;
  priceUntil: number;
  imageUrl: string;
  premium: boolean;
  phone: string;
  rating?: string;
};

/** GET /api/services/regular */
export type RegularServiceDto = {
  id: string;
  title: string;
  description: string;
  priceFrom: number;
  priceUntil: number;
  imageUrl: string;
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
