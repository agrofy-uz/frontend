import type { ServiceCardProps } from '@/shared/ui/card';

export type ServiceMockItem = ServiceCardProps & { id: string };

/** Demo / keyingi API almashtirish uchun */
export const MOCK_SERVICES: ServiceMockItem[] = [
  {
    id: 'irrigation',
    title: 'Dalada sug\u2018orish tizimini o\u2018rnatish',
    description:
      'Tomchilatib sug\u2018orish, nasos va filtrlash. Loyiha va ish boshlashgacha qo\u2018llab-quvvatlash.',
    priceFrom: 8_500_000,
    priceUntil: 45_000_000,
    imageUrl: 'https://picsum.photos/seed/agro-irrigation/640/400',
    badge: 'Mashhur',
    premium: true,
  },
  {
    id: 'soil',
    title: 'Yer tuproq tahlili',
    description:
      'NPK va mikroelementlar, pH, tuzlilik. Laboratoriya hisoboti 3\u20135 ish kuni ichida.',
    priceFrom: 350_000,
    priceUntil: 1_200_000,
    imageUrl: 'https://picsum.photos/seed/agro-soil/640/400',
    badge: 'Yangi',
    premium: true,
  },
  {
    id: 'drone',
    title: 'Drone orqali dalani monitoring',
    description:
      'Indeks rasmlar, zararkunandalar va suv tanqisligi zonalarini aniqlash.',
    priceFrom: 2_000_000,
    priceUntil: 12_000_000,
    imageUrl: 'https://picsum.photos/seed/agro-drone/640/400',
    badge: 'Chegirma',
    premium: true,
  },
  {
    id: 'seed',
    title: 'Urug\u2018 sertifikatsiyasi',
    description:
      'Laboratoriya tekshiruvlari va rasmiy hujjatlar. Don va sabzavot urug\u2018lari.',
    priceFrom: 180_000,
    priceUntil: 950_000,
    imageUrl: 'https://picsum.photos/seed/agro-seed/640/400',
    premium: true,
  },
  {
    id: 'tractor',
    title: 'Mini-traktor xizmati',
    description:
      'Dalani haydash, beda qilish va yuk tashish. Kunlik yoki mavsum shartnomasi.',
    priceFrom: 600_000,
    priceUntil: 4_500_000,
    imageUrl: 'https://picsum.photos/seed/agro-tractor/640/400',
    badge: 'Top',
    premium: true,
  },
  {
    id: 'greenhouse',
    title: 'Issiqxona montaji (turnkey)',
    description:
      'Polikarbonat, avtomatika, issiqlik va ventilyatsiya \u2014 kalit topshirish.',
    priceFrom: 55_000_000,
    priceUntil: 220_000_000,
    imageUrl: 'https://picsum.photos/seed/agro-greenhouse/640/400',
    premium: true,
  },
  {
    id: 'pesticide',
    title: 'Zararkunandalarga qarshi davolash',
    description:
      'Kimyoviy va biologik usullar. Drone yoki traktor bilan purkash xizmati.',
    priceFrom: 400_000,
    priceUntil: 3_200_000,
    imageUrl: 'https://picsum.photos/seed/agro-pest/640/400',
    badge: 'Mashhur',
    premium: true,
  },
  {
    id: 'consulting',
    title: 'Agro-konsalting xizmati',
    description:
      'Mutaxassis agronomingler bilan online va dala maslahatlashuvi, hisobot.',
    priceFrom: 150_000,
    priceUntil: 800_000,
    imageUrl: 'https://picsum.photos/seed/agro-consult/640/400',
    premium: true,
  },
  {
    id: 'harvest',
    title: 'Hosil yig\u2018im-terim xizmati',
    description:
      'Kombay\u0131n va texnika ijarasi. Don, makkajo\u2018xori va paxtaga mo\u2018ljallangan.',
    priceFrom: 1_200_000,
    priceUntil: 9_000_000,
    imageUrl: 'https://picsum.photos/seed/agro-harvest/640/400',
    badge: 'Mashhur',
    premium: true,
  },
  {
    id: 'water-analysis',
    title: 'Suv sifati tahlili',
    description:
      'Sug\u2018orish suvining kimyoviy tarkibi, tuzlilik va pH tekshiruvi.',
    priceFrom: 200_000,
    priceUntil: 700_000,
    imageUrl: 'https://picsum.photos/seed/agro-water/640/400',
    premium: true,
  },
];
