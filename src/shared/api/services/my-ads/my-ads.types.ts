/** GET /api/my-services */
export type MyServiceDto = {
  id: string;
  title: string;
  description: string;
  priceFrom: number;
  priceUntil: number;
  images: string[];
  rating?: number;
  premium: boolean;
  phone: string;
};
