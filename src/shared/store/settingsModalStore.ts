import { create } from 'zustand';

type SettingsModalState = {
  opened: boolean;
  open: () => void;
  close: () => void;
};

export const useSettingsModalStore = create<SettingsModalState>((set) => ({
  opened: false,
  open: () => set({ opened: true }),
  close: () => set({ opened: false }),
}));
