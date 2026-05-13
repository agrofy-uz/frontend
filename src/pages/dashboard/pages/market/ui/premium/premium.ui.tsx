import { Box, Title } from '@mantine/core';
import { Carousel, ResponsiveCarousel } from '@/shared/ui/carousel';
import { Card } from '@/shared/ui/card';
import { useMediaQuery } from '@mantine/hooks';
import type { MarketListItemDto } from '@/shared/api/services/market';

const FLUID_SLIDE_SIZE = {
  base: 'min(50%, 19rem)',
  svc700: 'min(33.333%, 19rem)',
  lg: 'min(25%, 19rem)',
  xl: 'min(20%, 19rem)',
  svcWide: 'min(16.667%, 19rem)',
} as const;

export type MarketPremiumSectionProps = {
  items: MarketListItemDto[];
  isLoading: boolean;
};

export function MarketPremiumSection({
  items,
  isLoading,
}: MarketPremiumSectionProps) {
  const premiumItems = items;
  const premiumCardsToRender = isLoading
    ? Array.from({ length: 6 }, (_, index) => ({
        id: `market-premium-loading-${index}`,
      }))
    : premiumItems;
  const showPremiumSection = isLoading || premiumItems.length > 0;
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (!showPremiumSection) return null;

  return (
    <>
      <Box>
        <Title order={isMobile ? 4 : 3}>Premium Mahsulotlar</Title>
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
          {premiumCardsToRender.map((item) => (
            <Carousel.Slide key={item.id}>
              <Box w="100%" style={{ display: 'flex' }}>
                <Card {...item} loading={isLoading} detailType="market" />
              </Box>
            </Carousel.Slide>
          ))}
        </ResponsiveCarousel>
      </Box>
    </>
  );
}
