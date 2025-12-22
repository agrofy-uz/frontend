import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ColorScheme } from '@mantine/core';

interface ThemeState {
  colorScheme: ColorScheme;
  toggleColorScheme: () => void;
  setColorScheme: (scheme: ColorScheme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      colorScheme: 'light',
      toggleColorScheme: () =>
        set((state) => ({
          colorScheme: state.colorScheme === 'light' ? 'dark' : 'light',
        })),
      setColorScheme: (scheme: ColorScheme) => set({ colorScheme: scheme }),
    }),
    {
      name: 'theme-storage',
    }
  )
);
