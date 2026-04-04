export type ServiceCategoryDto = {
  id: string;
  name: string;
  icon: string;
  count: number;
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
