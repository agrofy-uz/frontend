import type { IconType } from 'react-icons';
import {
  MdAgriculture,
  MdElectricBolt,
  MdGrass,
  MdHandyman,
  MdHomeRepairService,
  MdLocalShipping,
  MdOutlineScience,
  MdOutlineWater,
  MdPestControl,
  MdWarehouse,
  MdYard,
} from 'react-icons/md';

export type ServiceSidebarCategory = {
  id: string;
  label: string;
  count: number;
  icon: IconType;
};

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

/** Mock: keyinchalik API bilan almashtiriladi */
export const MOCK_SERVICE_SIDEBAR_CATEGORIES: ServiceSidebarCategory[] = [
  { id: 'irrigation', label: "Sug'orish", count: 12, icon: MdOutlineWater },
  { id: 'fertilizer', label: "O'g'itlash", count: 8, icon: MdGrass },
  { id: 'pest', label: 'Hashoratga qarshi', count: 24, icon: MdPestControl },
  { id: 'tech', label: 'Texnik xizmat', count: 5, icon: MdHandyman },
  { id: 'soil', label: 'Tuproq tahlili', count: 15, icon: MdYard },
  { id: 'transport', label: 'Transport', count: 3, icon: MdLocalShipping },
  { id: 'lab', label: 'Laboratoriya', count: 7, icon: MdOutlineScience },
  { id: 'storage', label: 'Ombor', count: 9, icon: MdWarehouse },
  { id: 'sowing', label: 'Ekin ekish', count: 18, icon: MdAgriculture },
  { id: 'harvest', label: "Hosil yig'ish", count: 11, icon: MdHomeRepairService },
  { id: 'analytics', label: 'Tahlil va hisobot', count: 4, icon: MdElectricBolt },
  { id: 'consulting', label: 'Konsalting', count: 2, icon: MdAgriculture },
];

/** Kengaytirilgan filter modalidagi mock maydonlar */
export const MOCK_SERVICE_FILTER_FIELDS = [
  { id: 'region', label: 'Hudud' },
  { id: 'season', label: 'Mavsum' },
  { id: 'price', label: 'Narx oralig‘i' },
  { id: 'rating', label: 'Reyting' },
  { id: 'availability', label: 'Mavjudlik' },
] as const;
