import * as FiIcons from 'react-icons/fi';
import * as FaIcons from 'react-icons/fa';
import type { IconType } from 'react-icons';

export const MAX_IMAGES = 3;

/** Bir slot: yangi fayl yoki serverdan qolgan URL */
export type ServiceImageSlot = {
  remoteUrl?: string;
  file?: File;
};

export function createEmptyImageSlots(): ServiceImageSlot[] {
  return Array.from({ length: MAX_IMAGES }, () => ({}));
}

export function imageSlotsFromRemoteUrls(urls: string[]): ServiceImageSlot[] {
  const slots = createEmptyImageSlots();
  urls.slice(0, MAX_IMAGES).forEach((url, i) => {
    const trimmed = url?.trim();
    if (trimmed) slots[i] = { remoteUrl: trimmed };
  });
  return slots;
}

export type SelectOption = { value: string; label: string };
export type CategoryOption = SelectOption & { icon?: string };

const ICON_REGISTRY: Record<string, IconType> = {
  ...(FiIcons as unknown as Record<string, IconType>),
  ...(FaIcons as unknown as Record<string, IconType>),
};

export function renderCategoryIcon(iconName?: string) {
  const Icon = (iconName && ICON_REGISTRY[iconName]) || FiIcons.FiGrid;
  return <Icon size={16} />;
}

export type ServiceCreateDraft = {
  categoryId: string | null;
  title: string;
  regionId: string | null;
  districtId: string | null;
  phone: string;
  priceFrom: string | number;
  priceUntil: string | number;
  description: string;
  telegram: string;
  instagram: string;
  premium?: boolean;
  imageSlots: ServiceImageSlot[];
};

export type ListingCreateKind = 'services' | 'products';

export function validateServiceCreateDraft(
  draft: ServiceCreateDraft,
  listingKind: ListingCreateKind = 'services',
): Record<string, string> {
  const isProduct = listingKind === 'products';
  const nextErrors: Record<string, string> = {};
  if (!draft.categoryId) {
    nextErrors.categoryId = isProduct ? 'Mahsulot turi majburiy' : 'Xizmat turi majburiy';
  }
  if (!draft.title.trim()) {
    nextErrors.title = isProduct ? 'Mahsulot nomi majburiy' : 'Xizmat nomi majburiy';
  }
  if (!draft.regionId) nextErrors.regionId = 'Viloyat majburiy';
  if (!draft.districtId) nextErrors.districtId = 'Tuman majburiy';

  const phoneDigits = draft.phone.replace(/\D/g, '');
  if (phoneDigits.length !== 12 || !phoneDigits.startsWith('998')) {
    nextErrors.phone = "To'liq telefon raqam kiriting";
  }

  if (Number(draft.priceFrom) <= 0) {
    nextErrors.priceFrom = "Boshlang'ich narx majburiy";
  }
  if (Number(draft.priceUntil) <= 0) {
    nextErrors.priceUntil = 'Oxirgi narx majburiy';
  }
  if (!draft.description.trim()) {
    nextErrors.description = isProduct
      ? 'Mahsulot haqida qisqacha matn majburiy'
      : 'Qisqacha majburiy';
  }
  const hasImage = draft.imageSlots.some((s) => Boolean(s.file || s.remoteUrl));
  if (!hasImage) nextErrors.images = 'Kamida 1 ta rasm yuklang';

  return nextErrors;
}

export function buildCreateServiceFormData(
  draft: ServiceCreateDraft,
): FormData {
  const phoneDigits = draft.phone.replace(/\D/g, '');

  const formData = new FormData();
  formData.append('categoryId', draft.categoryId ?? '');
  formData.append('title', draft.title.trim());
  formData.append('description', draft.description.trim());
  formData.append('priceFrom', String(Number(draft.priceFrom)));
  formData.append('priceUntil', String(Number(draft.priceUntil)));
  formData.append('phone', `+${phoneDigits}`);
  formData.append('region', draft.regionId ?? '');
  formData.append('district', draft.districtId ?? '');
  formData.append('premium', String(Boolean(draft.premium)));
  if (draft.telegram.trim()) formData.append('telegram', draft.telegram.trim());
  if (draft.instagram.trim()) formData.append('instagram', draft.instagram.trim());
  /** Tartib saqlanadi: eski rasm — `images` ga URL qatori, yangi — `images` ga fayl */
  draft.imageSlots.forEach((slot) => {
    if (slot.file) {
      formData.append('images', slot.file);
    } else if (slot.remoteUrl?.trim()) {
      formData.append('images', slot.remoteUrl.trim());
    }
  });

  return formData;
}
