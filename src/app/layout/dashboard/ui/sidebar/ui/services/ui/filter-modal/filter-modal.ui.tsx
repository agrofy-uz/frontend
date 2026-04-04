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
import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { Slider } from '@/shared/ui/slider';
import { Rating } from '@/shared/ui/rating';
import { Select } from '@/shared/ui/select';
import type { ServicesFilterValues } from '../../services.const';
import { DEFAULT_SERVICES_FILTER_VALUES } from '../../services.const';
import {
  FILTER_PRICE_MAX_SOM,
  FILTER_PRICE_MIN_SOM,
  formatSomLabel,
  MOCK_TUMANLAR_BY_REGION,
  MOCK_VILOYATLAR,
} from './filter-modal.const';

const MOBILE_BREAKPOINT = '(max-width: 48em)';

export interface ServicesFilterModalProps {
  opened: boolean;
  onClose: () => void;
  value: ServicesFilterValues;
  onApply: (next: ServicesFilterValues) => void;
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
        Narx (so‘m), viloyat/tuman va minimal reyting bo‘yicha tanlang.
      </Text>
    </Stack>
  );
}

export function ServicesFilterModal({
  opened,
  onClose,
  value,
  onApply,
}: ServicesFilterModalProps) {
  const isMobile = useMediaQuery(MOBILE_BREAKPOINT);
  const [draft, setDraft] = useState<ServicesFilterValues>(value);

  useEffect(() => {
    if (opened) setDraft({ ...value });
  }, [opened, value]);

  const districtData = useMemo(() => {
    if (!draft.regionId) return [];
    return MOCK_TUMANLAR_BY_REGION[draft.regionId] ?? [];
  }, [draft.regionId]);

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

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" verticalSpacing="lg">
        <Select
          label="Viloyat"
          placeholder="Qidiring yoki tanlang"
          data={MOCK_VILOYATLAR}
          value={draft.regionId}
          onChange={(regionId) =>
            setDraft((d) => ({ ...d, regionId, districtId: null }))
          }
          size="md"
        />
        <Select
          label="Tuman"
          placeholder={
            draft.regionId ? 'Qidiring yoki tanlang' : 'Avval viloyatni tanlang'
          }
          data={districtData}
          value={draft.districtId}
          onChange={(districtId) => setDraft((d) => ({ ...d, districtId }))}
          disabled={!draft.regionId || districtData.length === 0}
          nothingFoundMessage="Tuman topilmadi"
          size="md"
        />
      </SimpleGrid>

      <Rating
        label="Minimal reyting"
        description="0 — barcha xizmatlar"
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
        onClick={() => setDraft({ ...DEFAULT_SERVICES_FILTER_VALUES })}
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
