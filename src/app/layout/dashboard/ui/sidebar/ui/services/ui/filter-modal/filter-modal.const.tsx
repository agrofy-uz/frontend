import type { SelectItem } from '@/shared/ui/select';

/** Narx slayderi: so‘m */
export const FILTER_PRICE_MIN_SOM = 0;
export const FILTER_PRICE_MAX_SOM = 10_000_000;

export function formatSomLabel(value: number): string {
  return `${new Intl.NumberFormat('uz-UZ').format(value)} so‘m`;
}

export const MOCK_VILOYATLAR: SelectItem[] = [
  { value: 'toshkent_v', label: 'Toshkent viloyati' },
  { value: 'samarqand_v', label: 'Samarqand viloyati' },
  { value: 'buxoro_v', label: 'Buxoro viloyati' },
  { value: 'fargona_v', label: 'Farg‘ona viloyati' },
  { value: 'andijon_v', label: 'Andijon viloyati' },
  { value: 'namangan_v', label: 'Namangan viloyati' },
  { value: 'qashqadaryo_v', label: 'Qashqadaryo viloyati' },
  { value: 'surxondaryo_v', label: 'Surxondaryo viloyati' },
  { value: 'xorazm_v', label: 'Xorazm viloyati' },
  { value: 'navoiy_v', label: 'Navoiy viloyati' },
  { value: 'jizzax_v', label: 'Jizzax viloyati' },
  { value: 'sirdaryo_v', label: 'Sirdaryo viloyati' },
  { value: 'qoraqalpog_v', label: 'Qoraqalpog‘iston Respublikasi' },
];

export const MOCK_TUMANLAR_BY_REGION: Record<string, SelectItem[]> = {
  toshkent_v: [
    { value: 't_chinoz', label: 'Chinoz tumani' },
    { value: 't_buka', label: 'Bo‘ka tumani' },
    { value: 't_yangiyol', label: 'Yangiyo‘l tumani' },
    { value: 't_ohangaron', label: 'Ohangaron tumani' },
    { value: 't_oqqorgon', label: 'Oqqo‘rg‘on tumani' },
  ],
  samarqand_v: [
    { value: 's_samarqand', label: 'Samarqand tumani' },
    { value: 's_urgut', label: 'Urgut tumani' },
    { value: 's_kattaqorgon', label: 'Kattaqo‘rg‘on tumani' },
    { value: 's_bulungur', label: 'Bulung‘ur tumani' },
  ],
  buxoro_v: [
    { value: 'b_buxoro', label: 'Buxoro tumani' },
    { value: 'b_gijduvon', label: 'G‘ijduvon tumani' },
    { value: 'b_kogon', label: 'Kogon tumani' },
  ],
  fargona_v: [
    { value: 'f_fargona', label: 'Farg‘ona tumani' },
    { value: 'f_qoshtepa', label: 'Qo‘shtepa tumani' },
    { value: 'f_oltariq', label: 'Oltariq tumani' },
  ],
};
