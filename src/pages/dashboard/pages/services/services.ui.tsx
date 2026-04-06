import { useMemo } from 'react';
import { Box, Stack, Title } from '@mantine/core';
import { useSearchParams } from 'react-router-dom';
import { Carousel, ResponsiveCarousel } from '@/shared/ui/carousel';
import { MOCK_SERVICES } from '@/shared/data/services-mock.data';
import { SERVICES_SEARCH_QUERY_KEY } from '@/app/layout/dashboard/ui/sidebar/ui/services/services.const';
import { filterServicesSearch } from '@/shared/lib/filter-services-search';
import { Card } from '@/shared/ui/card';
import { SearchInput } from './ui/search-input/search-input.ui';
import s from './services.module.css';

/**
 * &lt; 700px: 2 ta; 700–1199px: 3 ta; 1200–1439px: 4 ta; 1440–1599px: 5 ta; ≥ 1600px: fluid.
 */
const FLUID_SLIDE_SIZE = {
  base: 'min(50%, 19rem)',
  svc700: 'min(33.333%, 19rem)',
  lg: 'min(25%, 19rem)',
  xl: 'min(20%, 19rem)',
  svcWide: 'min(16.667%, 19rem)',
} as const;

function Services() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get(SERVICES_SEARCH_QUERY_KEY) ?? '';

  const visibleServices = useMemo(() => {
    const t = q.trim();
    if (!t) return MOCK_SERVICES;
    return filterServicesSearch(MOCK_SERVICES, q, 100);
  }, [q]);

  return (
    <Box>
      <Stack gap="xs">
        <Box hiddenFrom="md">
          <SearchInput />
        </Box>

        <Box>
          <Title order={3}>Premium Xizmatlar</Title>
        </Box>

        <Box w="100%" maw="100%">
          <ResponsiveCarousel
            autoplayDelay={4500}
            hideControlsWhenAllFit
            type="media"
            slideSize={FLUID_SLIDE_SIZE}
            slideGap={{ base: 'xs', sm: 'sm', md: 'md', lg: 'md' }}
            emblaOptions={{ loop: true }}
          >
            {visibleServices.map(({ id, ...card }) => (
              <Carousel.Slide key={id}>
                <Box w="100%" style={{ display: 'flex' }}>
                  <Card
                    {...card}
                    onAction={() => {
                      // keyinchalik: xizmat sahifasi / modal
                    }}
                  />
                </Box>
              </Carousel.Slide>
            ))}
          </ResponsiveCarousel>
        </Box>
      </Stack>

      <Stack gap="md" mt="xl">
        <Title order={3}>Xizmatlar</Title>

        <Box className={s.servicesGrid}>
          {visibleServices.map(({ id, ...card }) => (
            <Box key={id} className={s.servicesGridItem} w="100%">
              <Card
                {...card}
                onAction={() => {
                  // keyinchalik: xizmat sahifasi / modal
                }}
              />
            </Box>
          ))}
        </Box>
      </Stack>
    </Box>
  );
}

export default Services;
