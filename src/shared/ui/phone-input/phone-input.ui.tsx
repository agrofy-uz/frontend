import { TextInput, type TextInputProps } from '@mantine/core';

const COUNTRY_CODE = '+998';
const MAX_LOCAL_DIGITS = 9;

function extractLocalDigits(value: string): string {
  const digits = value.replace(/\D/g, '');
  if (digits.startsWith('998')) {
    return digits.slice(3, 3 + MAX_LOCAL_DIGITS);
  }
  return digits.slice(0, MAX_LOCAL_DIGITS);
}

function formatLocalDigits(localDigits: string): string {
  const p1 = localDigits.slice(0, 2);
  const p2 = localDigits.slice(2, 5);
  const p3 = localDigits.slice(5, 7);
  const p4 = localDigits.slice(7, 9);

  if (!p1) return '';
  if (!p2) return `(${p1}`;
  if (!p3) return `(${p1}) ${p2}`;
  if (!p4) return `(${p1}) ${p2}-${p3}`;
  return `(${p1}) ${p2}-${p3}-${p4}`;
}

type PhoneInputProps = Omit<TextInputProps, 'value' | 'onChange' | 'type'> & {
  value: string;
  onChange: (value: string) => void;
};

export function PhoneInput({ value, onChange, ...props }: PhoneInputProps) {
  const localDigits = extractLocalDigits(value ?? '');
  const formattedLocal = formatLocalDigits(localDigits);
  const cleanPlaceholder = (props.placeholder ?? '(__) ___-__-__').replace(
    /^\+998\s*/,
    ''
  );

  return (
    <TextInput
      {...props}
      type="tel"
      leftSection={
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            color: 'light-dark(var(--mantine-color-dark-7), var(--mantine-color-gray-1))',
          }}
        >
          {COUNTRY_CODE}
        </span>
      }
      leftSectionWidth={50}
      placeholder={cleanPlaceholder}
      value={formattedLocal}
      styles={{
        input: {
          fontWeight: 600,
        },
      }}
      onChange={(event) => {
        const nextLocal = extractLocalDigits(event.currentTarget.value);
        const nextLocalFormatted = formatLocalDigits(nextLocal);
        onChange(
          nextLocalFormatted
            ? `${COUNTRY_CODE} ${nextLocalFormatted}`
            : COUNTRY_CODE
        );
      }}
    />
  );
}
