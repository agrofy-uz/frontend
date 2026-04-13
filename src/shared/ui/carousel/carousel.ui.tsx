import { Children, useEffect, useMemo, useState } from 'react';
import type { EmblaCarouselType } from 'embla-carousel';
import { Box, type BoxProps } from '@mantine/core';
import { Carousel, type CarouselProps } from '@mantine/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import s from './carousel.module.css';

/**
 * Har breakpointda taxminan nechta karta ko‘rinishi kerak bo‘lsa, shunga mos `slideSize` (%).
 * Mantine `includeGapInSize` (default) bo‘lganda ham odatda yaxshi ishlaydi.
 *
 * @example
 * slideSize={getSlideSizeByVisibleCount({ base: 2, sm: 3, md: 4, lg: 5, xl: 6 })}
 */
export function getSlideSizeByVisibleCount(
  counts: Partial<{
    base: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  }> & { base: number },
): CarouselProps['slideSize'] {
  const pct = (n: number) => `${Number((100 / n).toFixed(4))}%`;
  const out: Record<string, string> = { base: pct(counts.base) };
  (['xs', 'sm', 'md', 'lg', 'xl'] as const).forEach((bp) => {
    const v = counts[bp];
    if (v != null && v > 0) out[bp] = pct(v);
  });
  return out as CarouselProps['slideSize'];
}

const DEFAULT_SLIDE_SIZE: CarouselProps['slideSize'] =
  getSlideSizeByVisibleCount({ base: 1, sm: 2, md: 3, lg: 4 });

const DEFAULT_SLIDE_GAP: CarouselProps['slideGap'] = {
  base: 'xs',
  sm: 'md',
  lg: 'lg',
};

export type ResponsiveCarouselProps = Omit<
  CarouselProps,
  'plugins' | 'withIndicators' | 'children'
> &
  Pick<BoxProps, 'className' | 'style'> & {
    children: React.ReactNode;
    autoplayDelay?: number;
    withIndicators?: boolean;
    /**
     * `true`: viewport/slayd balandligi `height` prop bilan to‘ldiriladi (qisqa strip).
     * `false` (default): `height="auto"` — kontent (masalan ServiceCard) to‘liq ko‘rinadi.
     */
    fillViewportHeight?: boolean;
    /**
     * `true`: barcha kartalar bir vaqtning o‘zida sig‘sa chap/o‘ng tugmalar yashirinadi, markazlanadi;
     * scroll kerak bo‘lsa `emblaOptions.loop` (default `true`) qayta yoqiladi.
     */
    hideControlsWhenAllFit?: boolean;
  };

/**
 * Mantine Carousel + Embla autoplay.
 * Standart: `height="auto"` — kartalar kesilmaydi. Kerak bo‘lsa `fillViewportHeight` + `height`.
 */
export function ResponsiveCarousel({
  children,
  autoplayDelay = 4000,
  height: heightProp,
  fillViewportHeight = false,
  hideControlsWhenAllFit = false,
  withControls = true,
  withIndicators = false,
  slideSize = DEFAULT_SLIDE_SIZE,
  slideGap = DEFAULT_SLIDE_GAP,
  /** `media` — ekran kengligi bo‘yicha bir nechta slayd; `container` — faqat maxsus konteyner rejimi */
  type = 'media',
  emblaOptions,
  nextControlIcon,
  previousControlIcon,
  controlSize = 34,
  controlsOffset = 'sm',
  className,
  style,
  styles: userStyles,
  ...carouselProps
}: ResponsiveCarouselProps) {
  const { getEmblaApi: userGetEmblaApi, ...restCarouselProps } = carouselProps;

  const height = heightProp ?? (fillViewportHeight ? 'clamp(170px, 28vw, 260px)' : 'auto');

  const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);
  /** `hideControlsWhenAllFit` yoqilguncha tugmalar ko‘rinmasin — keyin Embla o‘lchab beradi */
  const [scrollNeeded, setScrollNeeded] = useState(!hideControlsWhenAllFit);
  /**
   * `loop: true` bo‘lsa `canScrollNext` doimiy `true` bo‘ladi; shuning uchun avval `loop: false` bilan
   * o‘lchaymiz, keyin scroll kerak bo‘lsa foydalanuvchi `loop` qayta yoqiladi.
   */
  const [hasMeasuredFit, setHasMeasuredFit] = useState(!hideControlsWhenAllFit);
  const slideCount = Children.count(children);

  useEffect(() => {
    if (!hideControlsWhenAllFit) {
      setScrollNeeded(true);
      setHasMeasuredFit(true);
      return;
    }
    if (!embla) return;

    const sync = () => {
      const snapCount = embla.scrollSnapList().length;
      const canScroll = embla.canScrollNext() || embla.canScrollPrev();
      setScrollNeeded(snapCount > 1 && canScroll);
      setHasMeasuredFit(true);
    };

    sync();
    embla.on('reInit', sync);
    embla.on('resize', sync);
    embla.on('select', sync);
    return () => {
      embla.off('reInit', sync);
      embla.off('resize', sync);
      embla.off('select', sync);
    };
  }, [embla, hideControlsWhenAllFit, slideCount]);

  const autoplayPlugin = useMemo(
    () =>
      Autoplay({
        delay: autoplayDelay,
        stopOnInteraction: false,
        stopOnMouseEnter: false,
      }),
    [autoplayDelay],
  );

  const mergedStyles = useMemo(() => {
    const fill =
      fillViewportHeight ||
      (heightProp != null && heightProp !== 'auto');
    const baseSlide = fill
      ? {
          height: '100%',
          display: 'flex' as const,
          minHeight: 0,
        }
      : {
          height: 'auto',
          display: 'flex' as const,
          alignItems: 'stretch' as const,
        };

    const baseViewport = fill ? { height: '100%' } : { height: 'auto' };

    const userContainer =
      userStyles && typeof userStyles === 'object' && 'container' in userStyles && userStyles.container
        ? userStyles.container
        : {};

    return {
      ...userStyles,
      container: {
        ...userContainer,
      },
      slide: {
        ...baseSlide,
        ...(userStyles && typeof userStyles === 'object' && 'slide' in userStyles
          ? userStyles.slide
          : {}),
      },
      viewport: {
        ...baseViewport,
        ...(userStyles && typeof userStyles === 'object' && 'viewport' in userStyles
          ? userStyles.viewport
          : {}),
      },
    };
  }, [userStyles, fillViewportHeight, heightProp, hideControlsWhenAllFit, scrollNeeded]);

  const showControls = withControls && (!hideControlsWhenAllFit || scrollNeeded);
  const useAutoplay = !(hideControlsWhenAllFit && !scrollNeeded);

  const effectiveLoop =
    hideControlsWhenAllFit && (!hasMeasuredFit || !scrollNeeded)
      ? false
      : (emblaOptions?.loop ?? true);

  return (
    <Box className={`${s.root} ${className ?? ''}`.trim()} style={style}>
      <Carousel
        {...restCarouselProps}
        withIndicators={withIndicators}
        withControls={showControls}
        plugins={useAutoplay ? [autoplayPlugin] : []}
        height={height}
        type={type}
        slideSize={slideSize}
        slideGap={slideGap}
        controlSize={controlSize}
        controlsOffset={controlsOffset}
        nextControlIcon={nextControlIcon ?? <BsChevronRight size={18} />}
        previousControlIcon={previousControlIcon ?? <BsChevronLeft size={18} />}
        styles={mergedStyles}
        getEmblaApi={(api) => {
          setEmbla(api);
          userGetEmblaApi?.(api);
        }}
        emblaOptions={{
          align: 'start',
          containScroll:
            emblaOptions?.containScroll ??
            (hideControlsWhenAllFit ? 'trimSnaps' : false),
          ...emblaOptions,
          loop: effectiveLoop,
        }}
      >
        {children}
      </Carousel>
    </Box>
  );
}

export { Carousel };
