import type { ServiceMockItem } from '@/shared/data/services-mock.data';

/** Sarlavha va tavsifda qidiruv; sarlavha mosligi ustun. */
export function filterServicesSearch(
  items: ServiceMockItem[],
  query: string,
  limit = 8,
): ServiceMockItem[] {
  const raw = query.trim().toLowerCase();
  if (!raw) return [];

  const tokens = raw.split(/\s+/).filter(Boolean);

  return items
    .map((item) => {
      const title = item.title.toLowerCase();
      const desc = item.description.toLowerCase();
      const hitTitle = tokens.every((t) => title.includes(t));
      const hitDesc = tokens.every((t) => desc.includes(t));
      const partialTitle = tokens.some((t) => title.includes(t));
      const partialDesc = tokens.some((t) => desc.includes(t));

      let score = 0;
      if (hitTitle) score += 100;
      else if (partialTitle) score += 40;
      if (hitDesc) score += 50;
      else if (partialDesc) score += 15;

      return { item, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.item);
}
