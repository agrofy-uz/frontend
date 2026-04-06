import { useState } from 'react';
import { Badge, Button, Text } from '@mantine/core';
import { MdBrokenImage } from 'react-icons/md';
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

export type CardProps = {
  title: string;
  description: string;
  /** Minimal narx */
  priceFrom: number;
  /** Maksimal / «gacha» narx */
  priceUntil: number;
  imageUrl?: string | null;
  /** Rasm ustidagi ixtiyoriy yorliq (masalan «Chegirma») */
  badge?: string | null;
  /** Tilla uslub, Premium yorlig‘i */
  premium?: boolean;
  /** Tugma matni */
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  imageAlt?: string;
};

export function Card({
  title,
  description,
  priceFrom,
  priceUntil,
  imageUrl,
  badge,
  premium = false,
  actionLabel = 'Bog‘lanish',
  onAction,
  className,
  imageAlt,
}: CardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const src = typeof imageUrl === 'string' ? imageUrl.trim() : '';
  const showImg = Boolean(src) && !imageFailed;

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
        {showImg ? (
          <img
            src={src}
            alt={imageAlt ?? title}
            onError={() => setImageFailed(true)}
            loading="lazy"
          />
        ) : (
          <div className={s.fallback} aria-hidden>
            <MdBrokenImage size={48} />
          </div>
        )}
      </div>

      <div className={s.body}>
        <Text className={s.title}>{title}</Text>
        <Text className={s.description}>{description}</Text>

        <div className={s.priceRow}>
          <Text component="span" className={s.priceLine}>
            <span className={s.priceLabel}>Narx:</span>{' '}
            <span className={s.priceFrom}>
              {formatServicePriceSom(priceFrom)}
            </span>
            <span className={s.priceMid}> dan - </span>
            <span className={s.priceUntil}>
              {formatServicePriceSom(priceUntil)} gacha
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
            onClick={onAction}
            classNames={premium ? { root: s.btnPremium } : undefined}
          >
            {actionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
