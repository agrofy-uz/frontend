import { useState } from 'react';
import {
  ActionIcon,
  Badge,
  Group,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { Carousel } from '@mantine/carousel';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { EmblaCarouselType } from 'embla-carousel';
import Autoplay from 'embla-carousel-autoplay';
import { useMediaQuery } from '@mantine/hooks';
import {
  FaInstagram,
  FaPhoneAlt,
  FaRegThumbsDown,
  FaRegThumbsUp,
  FaTelegramPlane,
} from 'react-icons/fa';
import { Modal } from '@/shared/ui/modal';
import { Button } from '@/shared/ui/button';
import {
  dislikeService,
  getServiceById,
  getServiceReactions,
  likeService,
} from '@/shared/api/services/services';
import s from './card-detail.module.css';
import { CardDetailSkeleton } from './ui';

type CardDetailModalProps = {
  serviceId: string | null;
  opened: boolean;
  onClose: () => void;
};

function getSocialLabel(value?: string): string {
  const raw = value?.trim();
  if (!raw) return '';

  try {
    const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const url = new URL(normalized);
    const fromPath = url.pathname.replace(/^\/+/, '').split('/')[0] ?? '';
    if (fromPath) return fromPath.replace(/^@/, '');
  } catch {
    // ignore and fallback to raw value
  }

  return raw
    .replace(/^https?:\/\/(www\.)?/i, '')
    .replace(/^t\.me\//i, '')
    .replace(/^instagram\.com\//i, '')
    .replace(/^@/, '')
    .split('/')[0];
}

function formatSom(value: number): string {
  const n = Math.trunc(value);
  const digits = Math.abs(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  const body = n < 0 ? `-${digits}` : digits;
  return `${body} so‘m`;
}

function formatRating(value?: number): string {
  if (typeof value !== 'number' || Number.isNaN(value)) return '0.0';
  return value.toFixed(1);
}

export function CardDetailModal({
  serviceId,
  opened,
  onClose,
}: CardDetailModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [embla, setEmbla] = useState<EmblaCarouselType | null>(null);
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery('(max-width: 48em)');
  const autoplay = Autoplay({
    delay: 3000,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  });
  const { data, isLoading } = useQuery({
    queryKey: ['service-detail', serviceId],
    queryFn: () => getServiceById(serviceId ?? ''),
    enabled: opened && Boolean(serviceId),
  });
  const { data: reactions } = useQuery({
    queryKey: ['service-reactions', serviceId],
    queryFn: () => getServiceReactions(serviceId ?? ''),
    enabled: opened && Boolean(serviceId),
    refetchInterval: 15000,
  });
  const likeMutation = useMutation({
    mutationFn: (id: string) => likeService(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['service-reactions', serviceId],
      });
    },
  });
  const dislikeMutation = useMutation({
    mutationFn: (id: string) => dislikeService(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ['service-reactions', serviceId],
      });
    },
  });

  const images = data?.images ?? [];
  const telegramHref = data?.telegram?.trim()
    ? data.telegram.startsWith('http')
      ? data.telegram
      : `https://t.me/${data.telegram.replace(/^@/, '')}`
    : '';
  const instagramHref = data?.instagram?.trim()
    ? data.instagram.startsWith('http')
      ? data.instagram
      : `https://instagram.com/${data.instagram.replace(/^@/, '')}`
    : '';
  const telegramLabel = getSocialLabel(data?.telegram);
  const instagramLabel = getSocialLabel(data?.instagram);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Xizmat tafsiloti"
      size="min(96vw, 980px)"
      radius="20px"
    >
      {isLoading ? (
        <CardDetailSkeleton />
      ) : !data ? (
        <Text c="dimmed">Xizmat tafsiloti topilmadi.</Text>
      ) : (
        <div className={s.layout}>
          <div>
            <Carousel
              withControls={false}
              withIndicators={false}
              slideSize="100%"
              slideGap={0}
              onSlideChange={setActiveIndex}
              getEmblaApi={setEmbla}
              emblaOptions={{ loop: true }}
              plugins={[autoplay]}
            >
              {images.map((src, index) => (
                <Carousel.Slide key={`${src}-${index}`}>
                  <img src={src} alt={data.title} className={s.mainImage} />
                </Carousel.Slide>
              ))}
            </Carousel>

            {images.length > 0 ? (
              <div className={s.thumbRow}>
                {images.map((src, index) => (
                  <button
                    key={`${src}-thumb-${index}`}
                    type="button"
                    className={`${s.thumbBtn} ${index === activeIndex ? s.thumbBtnActive : ''}`}
                    onClick={() => {
                      setActiveIndex(index);
                      embla?.scrollTo(index);
                    }}
                  >
                    <img
                      src={src}
                      alt={`${data.title} ${index + 1}`}
                      className={s.thumbImg}
                    />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <Stack gap={isMobile ? 8 : 10} h="100%">
            <Group justify="space-between" align="flex-start">
              <Title order={isMobile ? 4 : 3} className={s.titleClamp}>
                {data.title}
              </Title>
              {data.premium ? <Badge color="yellow">Premium</Badge> : null}
            </Group>

            <Text
              size={isMobile ? 'sm' : 'md'}
              c="dimmed"
              lh={1.55}
              className={s.descriptionClamp}
            >
              {data.description}
            </Text>
            <Text size={isMobile ? 'sm' : 'md'}>
              <Text component="span" fw={700}>
                Turkum:
              </Text>{' '}
              {data.category}
            </Text>
            <Text size={isMobile ? 'sm' : 'md'}>
              <span className={s.region}>{data.regions}</span> -{' '}
              {data.districts}
            </Text>
            <Text size={isMobile ? 'sm' : 'md'}>
              <Text component="span" fw={700}>
                Narx:
              </Text>{' '}
              {formatSom(data.priceFrom)} dan - {formatSom(data.priceUntil)}{' '}
              gacha
            </Text>

            {telegramHref ? (
              <a
                href={telegramHref}
                target="_blank"
                rel="noreferrer"
                className={s.socialLink}
              >
                <FaTelegramPlane size={15} />
                <span>{telegramLabel || 'Telegram'}</span>
              </a>
            ) : null}
            {instagramHref ? (
              <a
                href={instagramHref}
                target="_blank"
                rel="noreferrer"
                className={s.socialLink}
              >
                <FaInstagram size={15} />
                <span>{instagramLabel || 'Instagram'}</span>
              </a>
            ) : null}

            <div className={s.divider} />
            <Group gap="md" align="center">
              <Group gap={6}>
                <ActionIcon
                  variant={reactions?.myReaction === 'like' ? 'filled' : 'light'}
                  radius="md"
                  color="green"
                  size={34}
                  loading={likeMutation.isPending}
                  disabled={!serviceId || dislikeMutation.isPending}
                  onClick={() => {
                    if (!serviceId) return;
                    likeMutation.mutate(serviceId);
                  }}
                >
                  <FaRegThumbsUp size={16} />
                </ActionIcon>
                <Text size="sm" fw={600}>
                  {reactions?.likes ?? 0}
                </Text>
              </Group>
              <Badge variant="light" color="blue" radius="sm">
                Reyting: {formatRating(reactions?.rating)}
              </Badge>
              <Group gap={6}>
                <ActionIcon
                  variant={reactions?.myReaction === 'dislike' ? 'filled' : 'light'}
                  radius="md"
                  color="red"
                  size={34}
                  loading={dislikeMutation.isPending}
                  disabled={!serviceId || likeMutation.isPending}
                  onClick={() => {
                    if (!serviceId) return;
                    dislikeMutation.mutate(serviceId);
                  }}
                >
                  <FaRegThumbsDown size={16} />
                </ActionIcon>
                <Text size="sm" fw={600}>
                  {reactions?.dislikes ?? 0}
                </Text>
              </Group>
            </Group>

            <Button
              mt="auto"
              onClick={() => {
                if (!data.phone?.trim() || typeof window === 'undefined')
                  return;
                window.location.href = `tel:${data.phone.trim()}`;
              }}
            >
              <Group gap={8} wrap="nowrap">
                <FaPhoneAlt size={13} />
                <span>Bog‘lanish</span>
              </Group>
            </Button>
          </Stack>
        </div>
      )}
    </Modal>
  );
}
