/** GET /api/my-services */
export type MyServiceDto = {
  id: string;
  title: string;
  description?: string;
  regions?: string;
  districts?: string;
  priceFrom: number;
  priceUntil: number;
  images: string[];
  rating?: number;
  premium: boolean;
  phone: string;
};

export type CreateMyServicePayload = {
  categoryId: string;
  title: string;
  description: string;
  priceFrom: number;
  priceUntil: number;
  phone: string;
  region: string;
  district: string;
  telegram?: string;
  instagram?: string;
  premium?: boolean;
  images: File[];
};
