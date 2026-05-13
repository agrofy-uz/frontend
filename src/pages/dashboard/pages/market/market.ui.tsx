import { useMemo } from 'react';
import { Badge, Box, Group, Stack, Title } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getMarkets } from '@/shared/api/services/market';
import {
  MARKET_SEARCH_ENTER_CHIP_QUERY_KEY,
  MARKET_SEARCH_QUERY_KEY,
  buildMarketListApiParamsFromSearchParams,
} from '@/app/layout/dashboard/ui/sidebar/ui/market/market.const';
import { Card } from '@/shared/ui/card';
import { MarketPremiumSection } from './ui/premium';
import { MarketRegularEmpty } from './ui/regular-empty';
import { MarketSearchInput } from './ui/search-input/search-input.ui';
import s from './market.module.css';
import { useMediaQuery } from '@mantine/hooks';

function MarketSearchEnterChipSummary({
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

function Market() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get(MARKET_SEARCH_QUERY_KEY) ?? '';
  const showSearchEnterChip =
    searchParams.get(MARKET_SEARCH_ENTER_CHIP_QUERY_KEY) === '1';

  const listParams = useMemo(
    () => buildMarketListApiParamsFromSearchParams(searchParams),
    [searchParams]
  );

  const { data: marketsPage, isLoading: isListLoading } = useQuery({
    queryKey: ['market', 'list', listParams],
    queryFn: () => getMarkets(listParams),
    staleTime: 30_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const allItems = marketsPage?.items ?? [];
  const premiumFiltered = allItems.filter((item) => item.premium);
  const regularFiltered = allItems.filter((item) => !item.premium);

  const isMobile = useMediaQuery('(max-width: 768px)');
  const regularCardsToRender = isListLoading
    ? Array.from({ length: 8 }, (_, index) => ({
        id: `market-regular-loading-${index}`,
      }))
    : regularFiltered;

  const hasAnyResults =
    isListLoading || premiumFiltered.length > 0 || regularFiltered.length > 0;

  const emptyHint =
    !isListLoading && !hasAnyResults
      ? 'Filtrlarni yoki qidiruvni o\'zgartirib ko\'ring.'
      : undefined;

  return (
    <Box>
      <Stack gap="xs">
        {isMobile && (
          <Box>
            <MarketSearchInput />
          </Box>
        )}
        <MarketSearchEnterChipSummary
          q={q}
          showSearchEnterChip={showSearchEnterChip}
        />
        <MarketPremiumSection items={premiumFiltered} isLoading={isListLoading} />
      </Stack>

      {hasAnyResults ? (
        <Stack gap="md" mt="md">
          {regularFiltered.length > 0 || isListLoading ? (
            <>
              <Title order={isMobile ? 4 : 3}>Mahsulotlar</Title>
              <Box className={s.marketGrid}>
                {regularCardsToRender.map((card) => (
                  <Box key={card.id} className={s.marketGridItem} w="100%">
                    <Card {...card} loading={isListLoading} detailType="market" />
                  </Box>
                ))}
              </Box>
            </>
          ) : null}
        </Stack>
      ) : (
        <MarketRegularEmpty hint={emptyHint} />
      )}
    </Box>
  );
}

export default Market;
