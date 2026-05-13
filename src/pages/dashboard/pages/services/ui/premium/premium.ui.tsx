import { Box, Title } from '@mantine/core';
import { Carousel, ResponsiveCarousel } from '@/shared/ui/carousel';
import { Card } from '@/shared/ui/card';
import { useMediaQuery } from '@mantine/hooks';
import type { ServiceListItemDto } from '@/shared/api/services/services';

/**
 * < 700px: 2 ta; 700–1199px: 3 ta; 1200–1439px: 4 ta; 1440–1599px: 5 ta; >= 1600px: fluid.
 */
const FLUID_SLIDE_SIZE = {
  base: 'min(50%, 19rem)',
  svc700: 'min(33.333%, 19rem)',
  lg: 'min(25%, 19rem)',
  xl: 'min(20%, 19rem)',
  svcWide: 'min(16.667%, 19rem)',
} as const;

export type PremiumSectionProps = {
  items: ServiceListItemDto[];
  isLoading: boolean;
};

export function PremiumSection({ items, isLoading }: PremiumSectionProps) {
  const premiumServices = items;
  const premiumCardsToRender = isLoading
    ? Array.from({ length: 6 }, (_, index) => ({ id: `premium-loading-${index}` }))
    : premiumServices;
  const showPremiumSection = isLoading || premiumServices.length > 0;
  const isMobile = useMediaQuery('(max-width: 768px)');
  if (!showPremiumSection) return null;

  return (
    <>
      <Box>
        <Title order={isMobile ? 4 : 3}>Premium Xizmatlar</Title>
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
                <Card {...item} loading={isLoading} />
              </Box>
            </Carousel.Slide>
          ))}
        </ResponsiveCarousel>
      </Box>
    </>
  );
}
