import { SegmentedControl, type SegmentedControlProps } from '@mantine/core';

type SegmentedItem = {
  label: string;
  value: string;
};

type SegmentedProps = Omit<
  SegmentedControlProps,
  'data' | 'value' | 'onChange'
> & {
  data: SegmentedItem[];
  value: string;
  onChange: (value: string) => void;
};

export function Segmented({ data, value, onChange, ...props }: SegmentedProps) {
  return (
    <SegmentedControl
      data={data}
      value={value}
      onChange={onChange}
      radius="md"
      size="md"
      color="green"
      styles={() => ({
        root: {
          background:
            'light-dark(var(--mantine-color-white), var(--mantine-color-dark-6))',
        },
      })}
      {...props}
    />
  );
}
