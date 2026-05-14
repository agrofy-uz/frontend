import { create } from 'zustand';

type PricingModalState = {
  opened: boolean;
  open: () => void;
  close: () => void;
};

export const usePricingModalStore = create<PricingModalState>((set) => ({
  opened: false,
  open: () => set({ opened: true }),
  close: () => set({ opened: false }),
}));
