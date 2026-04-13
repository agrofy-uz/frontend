import { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge, Button, Text } from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { MdBrokenImage } from 'react-icons/md';
import { RatingValueDisplay } from '@/shared/ui/rating';
import { CardLoading } from './ui/card-loading';
import s from './card.module.css';

/** Mingliklar vergul emas, oddiy bo‘shliq bilan */
export function formatServicePriceSom(value: number): string {
  const n = Math.trunc(value);
  const digits = Math.abs(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const body = n < 0 ? `-${digits}` : digits;
  return `${body} so‘m`;
}

function formatServicePriceAmount(value: number): string {
  const n = Math.trunc(value);
  const digits = Math.abs(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return n < 0 ? `-${digits}` : digits;
}

export type CardProps = {
  id?: string;
  title?: string;
  description?: string;
  /** Minimal narx */
  priceFrom?: number;
  /** Maksimal / «gacha» narx */
  priceUntil?: number;
  /** Rasm URLlari (ketma-ket karusel) */
  images?: (string | null)[];
  /** Rasm ustidagi ixtiyoriy yorliq (masalan «Chegirma») */
  badge?: string | null;
  /** Tilla uslub, Premium yorlig‘i */
  premium?: boolean;
  /** Tugma matni */
  actionLabel?: string;
  /** API dan telefon kelganda tugma bosilishida qo‘ng‘iroq qilish uchun */
  phone?: string;
  /** Backend string bo‘lib kelishi mumkin (masalan "3.4") */
  rating?: string | number | null;
  loading?: boolean;
  onAction?: () => void;
  className?: string;
  imageAlt?: string;
};

export function Card({
  title = '',
  description = '',
  priceFrom = 0,
  priceUntil = 0,
  images: imagesProp,
  badge,
  premium = false,
  actionLabel = 'Bog‘lanish',
  phone,
  rating,
  loading = false,
  onAction,
  className,
  imageAlt,
}: CardProps) {
  const validUrls = useMemo(
    () =>
      (imagesProp ?? [])
        .map((u) => (typeof u === 'string' ? u.trim() : ''))
        .filter(Boolean),
    [imagesProp],
  );

  const [failedSlides, setFailedSlides] = useState<Set<number>>(() => new Set());

  const urlsKey = validUrls.join('\u0001');
  useEffect(() => {
    setFailedSlides(new Set());
  }, [urlsKey]);

  const markFailed = useCallback((index: number) => {
    setFailedSlides((prev) => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  }, []);

  if (loading) {
    return <CardLoading />;
  }

  const phoneText = typeof phone === 'string' ? phone.trim() : '';
  const parsedRating = Number(String(rating ?? '').replace(',', '.'));
  const hasRating = Number.isFinite(parsedRating);

  const handleAction = () => {
    if (onAction) {
      onAction();
      return;
    }
    if (phoneText && typeof window !== 'undefined') {
      window.location.href = `tel:${phoneText}`;
    }
  };

  const renderSlideContent = (url: string, index: number) => {
    if (failedSlides.has(index)) {
      return (
        <div className={s.fallback} aria-hidden>
          <MdBrokenImage size={48} />
        </div>
      );
    }
    return (
      <img
        className={s.slideImg}
        src={url}
        alt={imageAlt ?? title}
        onError={() => markFailed(index)}
        loading={index === 0 ? 'eager' : 'lazy'}
      />
    );
  };

  const showCarousel = validUrls.length > 1;

  return (
    <div
      className={`${s.root} ${premium ? s.premium : ''} ${className ?? ''}`.trim()}
    >
      <div className={s.media}>
        {(badge || premium) && (
          <div className={s.badgeWrap}>
            {badge ? (
              <Badge
                size="sm"
                variant="filled"
                color={premium ? 'yellow' : 'green'}
              >
                {badge}
              </Badge>
            ) : null}
            {premium ? (
              <Badge
                size="sm"
                variant="light"
                color="yellow"
                styles={{
                  root: {
                    background: 'rgba(212, 175, 55, 0.88)',
                    color: 'white',
                    border: '1px solid rgba(201, 163, 39, 0.53)',
                  },
                }}
              >
                Premium
              </Badge>
            ) : null}
          </div>
        )}
        {validUrls.length === 0 ? (
          <div className={s.fallback} aria-hidden>
            <MdBrokenImage size={48} />
          </div>
        ) : showCarousel ? (
          <Carousel
            classNames={{
              root: s.carouselRoot,
              viewport: s.carouselViewport,
              container: s.carouselContainer,
              slide: s.carouselSlide,
              indicators: s.carouselIndicators,
            }}
            h="100%"
            withControls={false}
            withIndicators
            slideSize="100%"
            slideGap={0}
            emblaOptions={{ loop: true }}
          >
            {validUrls.map((url, index) => (
              <Carousel.Slide key={`${url}-${index}`}>
                {renderSlideContent(url, index)}
              </Carousel.Slide>
            ))}
          </Carousel>
        ) : (
          renderSlideContent(validUrls[0], 0)
        )}
      </div>

      <div className={s.body}>
        <Text className={s.title}>{title}</Text>
        <Text className={s.description}>{description}</Text>
        {hasRating ? (
          <div className={s.ratingRow}>
            <RatingValueDisplay value={parsedRating} />
          </div>
        ) : null}

        <div className={s.priceRow}>
          <Text component="span" className={s.priceLine}>
            <span className={s.priceLabel}>Narx:</span>{' '}
            <span className={s.priceFrom}>
              {formatServicePriceAmount(priceFrom)}{' '}
              <span className={s.priceTail}>so‘m</span>
            </span>
            <span className={s.priceMid}> dan - </span>
            <span className={s.priceUntil}>
              {formatServicePriceAmount(priceUntil)}{' '}
              <span className={s.priceTail}>so‘m gacha</span>
            </span>
          </Text>
        </div>

        <div className={s.action}>
          <Button
            fullWidth
            size="sm"
            h={36}
            radius="md"
            color={premium ? undefined : 'green'}
            onClick={handleAction}
            classNames={premium ? { root: s.btnPremium } : undefined}
          >
            {actionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
