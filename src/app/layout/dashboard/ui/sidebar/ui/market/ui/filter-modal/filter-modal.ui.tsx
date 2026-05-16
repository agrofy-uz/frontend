import { useEffect, useMemo, useState } from 'react';
import {
  Button,
  Divider,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Text,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { getDistricts, getRegions } from '@/shared/api/services/market';
import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { Slider } from '@/shared/ui/slider';
import { Rating } from '@/shared/ui/rating';
import { Select } from '@/shared/ui/select';
import { ListingSheetSelect } from '@/shared/ui/listing-sheet-select';
import type { MarketFilterValues } from '../../market.const';
import { DEFAULT_MARKET_FILTER_VALUES } from '../../market.const';
import {
  FILTER_PRICE_MAX_SOM,
  FILTER_PRICE_MIN_SOM,
  formatSomLabel,
} from './filter-modal.const';

const MOBILE_BREAKPOINT = '(max-width: 48em)';

export interface MarketFilterModalProps {
  opened: boolean;
  onClose: () => void;
  value: MarketFilterValues;
  onApply: (next: MarketFilterValues) => void;
}

function FilterTitleBlock({
  reserveCloseSpace = false,
}: {
  reserveCloseSpace?: boolean;
}) {
  return (
    <Stack gap={6} pr={reserveCloseSpace ? 44 : 0}>
      <Text fw={700} size="xl" lh={1.2}>
        Kengaytirilgan filter
      </Text>
      <Text size="sm" c="dimmed" lh={1.45}>
        Narx (so‘m), viloyat/tuman va minimal reyting bo‘yicha mahsulotlarni
        tanlang.
      </Text>
    </Stack>
  );
}

export function MarketFilterModal({
  opened,
  onClose,
  value,
  onApply,
}: MarketFilterModalProps) {
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT);
  const [draft, setDraft] = useState<MarketFilterValues>(value);

  useEffect(() => {
    if (opened) setDraft({ ...value });
  }, [opened, value]);

  const regionsQuery = useQuery({
    queryKey: ['regions'],
    queryFn: () => getRegions(),
    enabled: opened,
    staleTime: 300_000,
  });

  const districtsQuery = useQuery({
    queryKey: ['districts', draft.regionId],
    queryFn: () => getDistricts(draft.regionId!),
    enabled: opened && Boolean(draft.regionId),
    staleTime: 300_000,
  });

  const regionSelectData = useMemo(
    () =>
      (regionsQuery.data ?? []).map((r) => ({
        value: r.id,
        label: r.name,
      })),
    [regionsQuery.data],
  );

  const districtSelectData = useMemo(
    () =>
      (districtsQuery.data ?? []).map((d) => ({
        value: d.id,
        label: d.name,
      })),
    [districtsQuery.data],
  );

  const formFields = (
    <>
      <Slider
        label="Narx (so‘m)"
        value={draft.priceRangeSom}
        onChange={(priceRangeSom) => setDraft((d) => ({ ...d, priceRangeSom }))}
        min={FILTER_PRICE_MIN_SOM}
        max={FILTER_PRICE_MAX_SOM}
        formatThumb={formatSomLabel}
        size="lg"
      />

      {isMobile ? (
        <Stack gap="lg">
          <ListingSheetSelect
            label="Viloyat"
            sheetTitle="Viloyatni tanlang"
            placeholder={
              regionsQuery.isPending ? 'Yuklanmoqda…' : 'Viloyatni tanlang'
            }
            value={draft.regionId}
            options={regionSelectData}
            onChange={(regionId) =>
              setDraft((d) => ({ ...d, regionId, districtId: null }))
            }
            disabled={regionsQuery.isPending || regionsQuery.isError}
            loading={regionsQuery.isPending}
            sheetZIndex={1400}
            size="md"
          />
          <ListingSheetSelect
            label="Tuman"
            sheetTitle="Tumanni tanlang"
            placeholder={
              !draft.regionId
                ? 'Avval viloyatni tanlang'
                : districtsQuery.isPending
                  ? 'Yuklanmoqda…'
                  : districtsQuery.isError
                    ? 'Yuklab bo‘lmadi'
                    : 'Tumanni tanlang'
            }
            value={draft.districtId}
            options={districtSelectData}
            onChange={(districtId) => setDraft((d) => ({ ...d, districtId }))}
            disabled={
              !draft.regionId ||
              districtsQuery.isPending ||
              districtsQuery.isError ||
              districtSelectData.length === 0
            }
            loading={districtsQuery.isPending}
            nothingFoundMessage="Tuman topilmadi"
            sheetZIndex={1400}
            size="md"
          />
        </Stack>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" verticalSpacing="lg">
          <Select
            label="Viloyat"
            placeholder={
              regionsQuery.isPending ? 'Yuklanmoqda…' : 'Qidiring yoki tanlang'
            }
            data={regionSelectData}
            value={draft.regionId}
            onChange={(regionId) =>
              setDraft((d) => ({ ...d, regionId, districtId: null }))
            }
            disabled={regionsQuery.isPending || regionsQuery.isError}
            size="md"
          />
          <Select
            label="Tuman"
            placeholder={
              !draft.regionId
                ? 'Avval viloyatni tanlang'
                : districtsQuery.isPending
                  ? 'Yuklanmoqda…'
                  : districtsQuery.isError
                    ? 'Yuklab bo‘lmadi'
                    : 'Qidiring yoki tanlang'
            }
            data={districtSelectData}
            value={draft.districtId}
            onChange={(districtId) => setDraft((d) => ({ ...d, districtId }))}
            disabled={
              !draft.regionId ||
              districtsQuery.isPending ||
              districtsQuery.isError ||
              districtSelectData.length === 0
            }
            nothingFoundMessage="Tuman topilmadi"
            size="md"
          />
        </SimpleGrid>
      )}

      <Rating
        label="Minimal reyting"
        description="0 — barcha mahsulotlar"
        value={draft.minRating}
        onChange={(minRating) => setDraft((d) => ({ ...d, minRating }))}
        size="lg"
      />
    </>
  );

  const modalFooter = (
    <Group justify="flex-end" gap="md" wrap="wrap">
      <Button
        variant="default"
        size="md"
        onClick={() => setDraft({ ...DEFAULT_MARKET_FILTER_VALUES })}
      >
        Qayta
      </Button>
      <Button
        color="green"
        size="md"
        onClick={() => {
          onApply(draft);
          onClose();
        }}
      >
        Qo‘llash
      </Button>
    </Group>
  );

  const sheetFooter = (
    <Group grow gap="sm" wrap="nowrap">
      <Button variant="default" size="md" fullWidth onClick={onClose}>
        Yopish
      </Button>
      <Button
        color="green"
        size="md"
        fullWidth
        onClick={() => {
          onApply(draft);
          onClose();
        }}
      >
        Qo‘llash
      </Button>
    </Group>
  );

  if (isMobile) {
    return (
      <BottomSheet opened={opened} onClose={onClose} footer={sheetFooter}>
        <Stack gap="xl" pb="md">
          <FilterTitleBlock />
          {formFields}
        </Stack>
      </BottomSheet>
    );
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="xl"
      radius="md"
      padding="xl"
      overlayProps={{ backgroundOpacity: 0.45, blur: 4 }}
      title={<FilterTitleBlock reserveCloseSpace />}
      styles={{
        header: { marginBottom: 4, alignItems: 'flex-start' },
        body: { paddingTop: 8 },
        content: { maxWidth: 720 },
      }}
    >
      <Stack gap="xl">
        {formFields}
        <Divider />
        {modalFooter}
      </Stack>
    </Modal>
  );
}
