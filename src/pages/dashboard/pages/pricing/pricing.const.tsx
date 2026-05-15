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

export type Plan = {
  id: string;
  name: string;
  slogan: string;
  price: string;
  period: string;
  color: string;
  gradient: string;
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
    gradient: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    icon: <HiOutlineXCircle size={22} />,
    cta: 'Bepul tarif',
    features: [
      { text: 'Kuniga 5 ta AI savol', included: true },
      { text: '1 ta mahsulot', included: true },
      { text: '1 ta xizmat', included: true },
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
    gradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    icon: <HiLightningBolt size={22} />,
    cta: 'GO ni tanlash',
    features: [
      { text: 'Kuniga 25 ta AI savol', included: true },
      { text: 'Voice to text', included: true },
      { text: '5 ta mahsulot', included: true },
      { text: '3 ta xizmat', included: true },
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
    color: 'blue',
    gradient: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
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
    color: 'violet',
    gradient: 'linear-gradient(135deg, #faf5ff 0%, #ede9fe 100%)',
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

export const COLOR_MAP: Record<
  string,
  { icon: string; ring: string; badge: string }
> = {
  gray: { icon: '#94a3b8', ring: '#e2e8f0', badge: '#64748b' },
  green: { icon: '#22c55e', ring: '#bbf7d0', badge: '#16a34a' },
  blue: { icon: '#3b82f6', ring: '#bfdbfe', badge: '#2563eb' },
  violet: { icon: '#8b5cf6', ring: '#ddd6fe', badge: '#7c3aed' },
};
