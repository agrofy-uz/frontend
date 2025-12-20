import { MantineProvider, useMantineColorScheme } from '@mantine/core';
import '@mantine/core/styles.layer.css';
import '@mantine/dates/styles.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { initializeLocale } from '@/shared/lib/language';
import queryClient from '@/shared/queryClient';
import { useThemeStore } from '@/shared/store/themeStore';
import theme from '@/shared/theme';

interface ProvidersProps {
  children: React.ReactNode;
}

const ThemeSync = ({ children }: ProvidersProps) => {
  const { colorScheme } = useThemeStore();
  const { setColorScheme } = useMantineColorScheme();

  useEffect(() => {
    setColorScheme(colorScheme);
  }, [colorScheme, setColorScheme]);

  return <>{children}</>;
};

const Providers = ({ children }: ProvidersProps) => {
  const { colorScheme } = useThemeStore();

  useEffect(() => {
    initializeLocale();
  }, []);

  return (
    <MantineProvider theme={theme} defaultColorScheme={colorScheme}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ThemeSync>{children}</ThemeSync>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </BrowserRouter>
    </MantineProvider>
  );
};

export default Providers;
