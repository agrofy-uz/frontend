import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const ColorScheme = {
  light: 'light',
  dark: 'dark',
} as const;
type ColorSchemeType = (typeof ColorScheme)[keyof typeof ColorScheme];
interface ThemeState {
  colorScheme: ColorSchemeType;
  toggleColorScheme: () => void;
  setColorScheme: (scheme: ColorSchemeType) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      colorScheme: ColorScheme.light,
      toggleColorScheme: () =>
        set((state) => ({
          colorScheme:
            state.colorScheme === ColorScheme.light
              ? ColorScheme.dark
              : ColorScheme.light,
        })),
      setColorScheme: (scheme: ColorSchemeType) =>
        set({ colorScheme: scheme as ColorSchemeType }),
    }),
    {
      name: 'theme-storage',
    }
  )
);
