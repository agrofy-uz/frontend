import {
  HiLightningBolt,
  HiOutlineXCircle,
  HiSparkles,
  HiStar,
} from 'react-icons/hi';

export type Feature = {
  text: string;
  included: boolean;
};

export type PlanColor = 'gray' | 'green' | 'blue' | 'violet';

export type Plan = {
  id: string;
  name: string;
  slogan: string;
  price: string;
  period: string;
  /** Faqat ikonka / CTA accent (karta foni bir xil) */
  color: PlanColor;
  badge?: string;
  icon: React.ReactNode;
  features: Feature[];
  cta: string;
  highlight?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: 'free',
    name: "FREE — Boshlang'ich",
    slogan: 'Boshlash uchun yetarli',
    price: "0 so'm",
    period: '',
    color: 'gray',
    icon: <HiOutlineXCircle size={22} />,
    cta: 'Bepul tarif',
    features: [
      { text: 'Kuniga 5 ta AI savol', included: true },
      { text: '2 ta mahsulot', included: true },
      { text: '3 ta xizmat', included: true },
      { text: 'Oddiy listing', included: true },
    ],
  },
  {
    id: 'go',
    name: 'GO — 1 oylik',
    slogan: "Tez start, ko'proq imkoniyat",
    price: "29 999 so'm",
    period: '1 oy',
    color: 'green',
    icon: <HiLightningBolt size={22} />,
    cta: 'GO ni tanlash',
    features: [
      { text: 'Kuniga 25 ta AI savol', included: true },
      { text: 'Voice to text', included: true },
      { text: '5 ta mahsulot', included: true },
      { text: '4 ta xizmat', included: true },
      { text: 'Priority listing', included: true },
      { text: 'Verified badge', included: true },
    ],
  },
  {
    id: 'plus',
    name: 'PLUS — 3 oylik',
    slogan: "Ko'rinuvchanlik va tahlil",
    price: "79 999 so'm",
    period: '3 oy',
    color: 'green',
    badge: 'Mashhur',
    icon: <HiStar size={22} />,
    cta: 'PLUS ni tanlash',
    highlight: true,
    features: [
      { text: 'Kuniga 80 ta AI savol', included: true },
      { text: 'AI rasm yuklash', included: true },
      { text: "O'simlik kasalligi tahlili", included: true },
      { text: '15 ta mahsulot', included: true },
      { text: '10 ta xizmat', included: true },
      { text: 'Carousel listing', included: true },
      { text: 'Analitika', included: true },
    ],
  },
  {
    id: 'pro',
    name: 'PRO — 6 oylik',
    slogan: "Maksimal vosita to'plami",
    price: "149 999 so'm",
    period: '6 oy',
    color: 'green',
    badge: 'Eng kuchli',
    icon: <HiSparkles size={22} />,
    cta: 'PRO ni tanlash',
    features: [
      { text: 'Kuniga 250 ta AI savol', included: true },
      { text: 'Voice AI', included: true },
      { text: 'Cheksiz listing', included: true },
      { text: 'Eng yuqori ustuvorlik', included: true },
      { text: 'AI avto tavsif', included: true },
      { text: 'AI avto teglar', included: true },
      { text: "To'liq analitika", included: true },
      { text: "Premium qo'llab-quvvatlash", included: true },
    ],
  },
];
