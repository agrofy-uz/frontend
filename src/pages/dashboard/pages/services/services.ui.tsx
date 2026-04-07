import { useMemo } from 'react';
import { Box, Stack, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getRegularServices } from '@/shared/api/services/services';
import { SERVICES_SEARCH_QUERY_KEY } from '@/app/layout/dashboard/ui/sidebar/ui/services/services.const';
import { filterServicesSearch } from '@/shared/lib/filter-services-search';
import { Card } from '@/shared/ui/card';
import { PremiumSection } from './ui/premium';
import { RegularEmpty } from './ui/regular-empty';
import { SearchInput } from './ui/search-input/search-input.ui';
import s from './services.module.css';
import { useMediaQuery } from '@mantine/hooks';

function Services() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get(SERVICES_SEARCH_QUERY_KEY) ?? '';
  const { data: regularFromApi, isLoading: isRegularLoading } = useQuery({
    queryKey: ['services', 'regular'],
    queryFn: getRegularServices,
  });
  const isMobile = useMediaQuery('(max-width: 768px)');
  const visibleServices = useMemo(() => {
    const source = regularFromApi ?? [];
    const t = q.trim();
    if (!t) return source;
    return filterServicesSearch(source, q, 100);
  }, [q, regularFromApi]);
  const cardsToRender = isRegularLoading
    ? Array.from({ length: 8 }, (_, index) => ({
        id: `regular-loading-${index}`,
      }))
    : visibleServices;

  return (
    <Box>
      <Stack gap="xs">
        <Box hiddenFrom="md">
          <SearchInput />
        </Box>
        <PremiumSection />
      </Stack>

      {cardsToRender.length > 0 ? (
        <Stack gap="md" mt="md">
          <Title order={isMobile ? 4 : 3}>Xizmatlar</Title>

          <Box className={s.servicesGrid}>
            {cardsToRender.map((card) => (
              <Box key={card.id} className={s.servicesGridItem} w="100%">
                <Card {...card} loading={isRegularLoading} />
              </Box>
            ))}
          </Box>
        </Stack>
      ) : (
        <RegularEmpty />
      )}
    </Box>
  );
}

export default Services;
