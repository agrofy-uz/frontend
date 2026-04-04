/** Narx slayderi: so‘m */
export const FILTER_PRICE_MIN_SOM = 0;
export const FILTER_PRICE_MAX_SOM = 10_000_000;

export function formatSomLabel(value: number): string {
  return `${new Intl.NumberFormat('uz-UZ').format(value)} so‘m`;
}
