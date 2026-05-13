/** GET /api/my-services */
export type MyServiceDto = {
  id: string;
  title: string;
  description?: string;
  regions?: string;
  districts?: string;
  /** API qaytarsa, forma tanlovlarini to‘g‘ridan-to‘g‘ri bog‘lash uchun */
  categoryId?: string;
  /** GET /services/:id yoki GET /market/:id `category` maydoni (tur nomi) */
  category?: string;
  regionId?: string;
  districtId?: string;
  telegram?: string;
  instagram?: string;
  priceFrom: number;
  priceUntil: number;
  images: string[];
  rating?: number;
  premium: boolean;
  phone: string;
};

/** GET /api/my-products — shakl xizmatlar ro‘yxati bilan bir xil */
export type MyProductDto = MyServiceDto;

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

/** POST/PUT my-products — maydonlar xizmatlar bilan bir xil */
export type CreateMyProductPayload = CreateMyServicePayload;
