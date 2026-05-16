import { useMemo, useState, type ReactNode } from 'react';
import {
  Group,
  Input,
  Loader,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import type { MantineSize, TextInputProps } from '@mantine/core';
import { IoChevronDown } from 'react-icons/io5';
import { MdCheck } from 'react-icons/md';
import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { LISTING_SHEET_SELECT_DEFAULT_Z_INDEX } from './listing-sheet-select.const';
import styles from './listing-sheet-select.module.css';

export type ListingSheetSelectOption = {
  value: string;
  label: string;
  icon?: string;
};

export type ListingSheetSelectProps = {
  label: string;
  sheetTitle: string;
  placeholder: string;
  value: string | null;
  options: ListingSheetSelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  error?: string;
  searchable?: boolean;
  nothingFoundMessage?: string;
  size?: MantineSize;
  inputStyles?: TextInputProps['styles'];
  renderOptionStart?: (option: ListingSheetSelectOption) => ReactNode;
  renderTriggerStart?: () => ReactNode;
  /** Boshqa sheet (masalan, filter) ustida ochilganda */
  sheetZIndex?: number;
};

export function ListingSheetSelect({
  label,
  sheetTitle,
  placeholder,
  value,
  options,
  onChange,
  disabled,
  loading,
  required,
  error,
  searchable = true,
  nothingFoundMessage = 'Topilmadi',
  size = 'md',
  inputStyles,
  renderOptionStart,
  renderTriggerStart,
  sheetZIndex,
}: ListingSheetSelectProps) {
  const [opened, setOpened] = useState(false);
  const [search, setSearch] = useState('');

  const selectedLabel = options.find((o) => o.value === value)?.label;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, search]);

  const closeSheet = () => {
    setOpened(false);
    setSearch('');
  };

  const openSheet = () => {
    if (disabled || loading) return;
    setOpened(true);
  };

  const handlePick = (next: string) => {
    onChange(next);
    closeSheet();
  };

  return (
    <>
      <Input.Wrapper label={label} required={required} error={error} size={size}>
        <UnstyledButton
          type="button"
          className={styles.trigger}
          disabled={disabled || loading}
          data-error={error ? true : undefined}
          onClick={openSheet}
          aria-haspopup="dialog"
          aria-expanded={opened}
        >
          <Group gap="xs" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
            {renderTriggerStart?.()}
            <span
              className={`${styles.triggerValue} ${selectedLabel ? '' : styles.triggerPlaceholder}`}
            >
              {selectedLabel ?? placeholder}
            </span>
          </Group>
          {loading ? (
            <Loader size="sm" />
          ) : (
            <IoChevronDown size={18} style={{ flexShrink: 0, opacity: 0.55 }} />
          )}
        </UnstyledButton>
      </Input.Wrapper>

      <BottomSheet
        opened={opened}
        onClose={closeSheet}
        zIndex={sheetZIndex ?? LISTING_SHEET_SELECT_DEFAULT_Z_INDEX}
        hiddenTitle={sheetTitle}
        size="min(72dvh, 520px)"
      >
        <Stack gap="md" pb="xs">
          <Text fw={700} size="lg" lh={1.25}>
            {sheetTitle}
          </Text>

          {searchable ? (
            <TextInput
              placeholder="Qidirish..."
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              size="md"
              styles={inputStyles}
              autoComplete="off"
            />
          ) : null}

          <div className={styles.optionList}>
            {filtered.length === 0 ? (
              <Text size="sm" c="dimmed" ta="center" py="lg">
                {nothingFoundMessage}
              </Text>
            ) : (
              <Stack gap={4}>
                {filtered.map((opt) => {
                  const active = opt.value === value;
                  return (
                    <UnstyledButton
                      key={opt.value}
                      type="button"
                      className={`${styles.option} ${active ? styles.optionActive : ''}`}
                      onClick={() => handlePick(opt.value)}
                    >
                      <Group gap="xs" wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
                        {renderOptionStart?.(opt)}
                        <Text
                          className={styles.optionLabel}
                          fw={active ? 600 : 400}
                          c={active ? 'green.7' : undefined}
                        >
                          {opt.label}
                        </Text>
                      </Group>
                      {active ? (
                        <MdCheck size={20} color="var(--mantine-color-green-6)" />
                      ) : null}
                    </UnstyledButton>
                  );
                })}
              </Stack>
            )}
          </div>
        </Stack>
      </BottomSheet>
    </>
  );
}
