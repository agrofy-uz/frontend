import { useMemo } from 'react';
import { Badge, Box, Group, Stack, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getServices } from '@/shared/api/services/services';
import {
  SERVICES_SEARCH_ENTER_CHIP_QUERY_KEY,
  SERVICES_SEARCH_QUERY_KEY,
  buildServicesListApiParamsFromSearchParams,
} from '@/app/layout/dashboard/ui/sidebar/ui/services/services.const';
import { Card } from '@/shared/ui/card';
import { PremiumSection } from './ui/premium';
import { RegularEmpty } from './ui/regular-empty';
import { SearchInput } from './ui/search-input/search-input.ui';
import s from './services.module.css';
import { useMediaQuery } from '@mantine/hooks';

/** Faqat inputdan Enter bilan commit qilingan qidiruv chipi */
function ServicesSearchEnterChipSummary({
  q,
  showSearchEnterChip,
}: {
  q: string;
  showSearchEnterChip: boolean;
}) {
  const qt = q.trim();
  if (!qt || !showSearchEnterChip) return null;

  return (
    <Box visibleFrom="md" mb="xs">
      <Group gap="xs" wrap="wrap" align="center">
        <Badge variant="light" color="gray" size="sm" radius="sm">
          Qidiruv: {qt}
        </Badge>
      </Group>
    </Box>
  );
}

function Services() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get(SERVICES_SEARCH_QUERY_KEY) ?? '';
  const showSearchEnterChip =
    searchParams.get(SERVICES_SEARCH_ENTER_CHIP_QUERY_KEY) === '1';

  const listParams = useMemo(
    () => buildServicesListApiParamsFromSearchParams(searchParams),
    [searchParams]
  );

  const { data: servicesPage, isLoading: isListLoading } = useQuery({
    queryKey: ['services', 'list', listParams],
    queryFn: () => getServices(listParams),
    staleTime: 30_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const allItems = servicesPage?.items ?? [];
  const premiumFiltered = allItems.filter((item) => item.premium);
  const regularFiltered = allItems.filter((item) => !item.premium);

  const isMobile = useMediaQuery('(max-width: 768px)');
  const regularCardsToRender = isListLoading
    ? Array.from({ length: 8 }, (_, index) => ({
        id: `regular-loading-${index}`,
      }))
    : regularFiltered;

  const hasAnyResults =
    isListLoading || premiumFiltered.length > 0 || regularFiltered.length > 0;

  const emptyHint =
    !isListLoading && !hasAnyResults
      ? 'Filtrlarni yoki qidiruvni o‘zgartirib ko‘ring.'
      : undefined;

  return (
    <Box>
      <Stack gap="xs">
        {isMobile && (
          <Box>
            <SearchInput />
          </Box>
        )}
        <ServicesSearchEnterChipSummary
          q={q}
          showSearchEnterChip={showSearchEnterChip}
        />
        <PremiumSection items={premiumFiltered} isLoading={isListLoading} />
      </Stack>

      {hasAnyResults ? (
        <Stack gap="md" mt="md">
          {regularFiltered.length > 0 || isListLoading ? (
            <>
              <Title order={isMobile ? 4 : 3}>Xizmatlar</Title>
              <Box className={s.servicesGrid}>
                {regularCardsToRender.map((card) => (
                  <Box key={card.id} className={s.servicesGridItem} w="100%">
                    <Card {...card} loading={isListLoading} />
                  </Box>
                ))}
              </Box>
            </>
          ) : null}
        </Stack>
      ) : (
        <RegularEmpty hint={emptyHint} />
      )}
    </Box>
  );
}

export default Services;
