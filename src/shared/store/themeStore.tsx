import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { useColorScheme } from '@mantine/hooks';

interface ThemeState {
  colorScheme: ReturnType<typeof useColorScheme>;
  toggleColorScheme: () => void;
  setColorScheme: (scheme: ReturnType<typeof useColorScheme>) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      colorScheme: 'light',
      toggleColorScheme: () =>
        set((state) => ({
          colorScheme: state.colorScheme === 'light' ? 'dark' : 'light',
        })),
      setColorScheme: (scheme: ReturnType<typeof useColorScheme>) =>
        set({ colorScheme: scheme }),
    }),
    {
      name: 'theme-storage',
    }
  )
);
