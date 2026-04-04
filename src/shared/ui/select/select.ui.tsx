import { Select as MantineSelect } from '@mantine/core';
import type { MantineSize } from '@mantine/core';

export type SelectItem = { value: string; label: string };

export interface SelectProps {
  label: string;
  placeholder?: string;
  data: SelectItem[];
  value: string | null;
  onChange: (value: string | null) => void;
  disabled?: boolean;
  nothingFoundMessage?: string;
  clearable?: boolean;
  size?: MantineSize;
}

export function Select({
  label,
  placeholder = 'Tanlang',
  data,
  value,
  onChange,
  disabled,
  nothingFoundMessage = 'Topilmadi',
  clearable = true,
  size = 'sm',
}: SelectProps) {
  return (
    <MantineSelect
      label={label}
      placeholder={placeholder}
      data={data}
      value={value ?? null}
      onChange={(v) => onChange(v ?? null)}
      searchable
      clearable={clearable}
      disabled={disabled}
      nothingFoundMessage={nothingFoundMessage}
      comboboxProps={{ withinPortal: true }}
      size={size}
    />
  );
}
