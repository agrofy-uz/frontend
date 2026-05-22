import { Stack, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Button } from '@/shared/ui/button';
import { usePricingModalStore } from '@/shared/store/pricingModalStore';
import { MY_ADS_MOBILE_MQ } from '../../../../my-ads.const';
import styles from './create-limit-overlay.module.css';
import { HiLightningBolt } from 'react-icons/hi';

type CreateLimitOverlayProps = {
  kind: 'services' | 'products';
  onClose: () => void;
};

const COPY = {
  services: {
    title: 'Xizmatlar limiti tugadi',
    description:
      'Joriy tarif bo‘yicha yangi xizmat qo‘shib bo‘lmaydi. Limitni oshirish uchun tarifni yangilang.',
  },
  products: {
    title: 'Mahsulotlar limiti tugadi',
    description:
      'Joriy tarif bo‘yicha yangi mahsulot qo‘shib bo‘lmaydi. Limitni oshirish uchun tarifni yangilang.',
  },
} as const;

/** Forma ustidagi blur qatlam — forma doim ko‘rinadi */
export function CreateLimitOverlay({ kind, onClose }: CreateLimitOverlayProps) {
  const isMobile = useMediaQuery(MY_ADS_MOBILE_MQ);
  const copy = COPY[kind];
  const openPricing = usePricingModalStore((s) => s.open);

  const handleUpgrade = () => {
    onClose();
    openPricing();
  };

  return (
    <div
      className={styles.root}
      role="presentation"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => e.stopPropagation()}
    >
      <Stack
        className={styles.content}
        align="center"
        justify="center"
        gap="md"
        ta="center"
      >
        <Text className={styles.title} fw={700} size={isMobile ? 'md' : 'lg'}>
          {copy.title}
        </Text>
        <Text className={styles.description} c="dimmed" maw={360} size="sm">
          {copy.description}
        </Text>
        <Button
          type="button"
          variant="filled"
          color="green"
          h={isMobile ? 40 : 42}
          px="xl"
          onClick={handleUpgrade}
          leftSection={<HiLightningBolt />}
        >
          Tarifni yangilash
        </Button>
      </Stack>
    </div>
  );
}
