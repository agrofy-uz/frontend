import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';
import classes from './otp-input.module.css';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
}

function digitsFromValue(value: string, length: number): string[] {
  const digits = Array.from({ length }, () => '');
  value
    .replace(/\D/g, '')
    .slice(0, length)
    .split('')
    .forEach((digit, index) => {
      digits[index] = digit;
    });
  return digits;
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  disabled,
  error = false,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const focusIndexRef = useRef<number | null>(null);
  const lastEmittedRef = useRef(value);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [digits, setDigits] = useState(() => digitsFromValue(value, length));

  useEffect(() => {
    if (value === lastEmittedRef.current) return;
    lastEmittedRef.current = value;
    setDigits(digitsFromValue(value, length));
  }, [value, length]);

  useLayoutEffect(() => {
    const index = focusIndexRef.current;
    if (index === null) return;
    focusIndexRef.current = null;

    const input = inputRefs.current[index];
    if (!input) return;

    input.focus({ preventScroll: true });
    const pos = input.value.length;
    input.setSelectionRange(pos, pos);
  });

  const commitDigits = (nextDigits: string[], focusIndex?: number) => {
    const joined = nextDigits.join('');
    setDigits(nextDigits);
    lastEmittedRef.current = joined;
    onChange(joined);

    if (focusIndex !== undefined) {
      focusIndexRef.current = focusIndex;
    }
  };

  const applyDigitsFrom = (startIndex: number, raw: string) => {
    const incoming = raw.replace(/\D/g, '');
    const nextDigits = [...digits];

    if (!incoming) {
      nextDigits[startIndex] = '';
      commitDigits(nextDigits, startIndex);
      return;
    }

    let cursor = startIndex;
    for (const digit of incoming) {
      if (cursor >= length) break;
      nextDigits[cursor] = digit;
      cursor += 1;
    }

    const focusIndex = cursor >= length ? length - 1 : cursor;
    commitDigits(nextDigits, focusIndex);
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const nextDigits = [...digits];

      if (digits[index]) {
        nextDigits[index] = '';
        commitDigits(nextDigits, index);
        return;
      }

      if (index > 0) {
        nextDigits[index - 1] = '';
        commitDigits(nextDigits, index - 1);
      }
      return;
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      focusIndexRef.current = index - 1;
      inputRefs.current[index - 1]?.focus({ preventScroll: true });
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault();
      focusIndexRef.current = index + 1;
      inputRefs.current[index + 1]?.focus({ preventScroll: true });
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    if (!pastedData) return;
    applyDigitsFrom(0, pastedData);
  };

  return (
    <div className={classes.row} data-mobile={isMobile || undefined}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          className={`${classes.cell} ${error ? classes.cellError : ''}`}
          value={digit}
          onChange={(e) => applyDigitsFrom(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={(e) => {
            focusIndexRef.current = index;
            const pos = e.currentTarget.value.length;
            e.currentTarget.setSelectionRange(pos, pos);
          }}
          disabled={disabled}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          maxLength={length}
          aria-label={`OTP raqam ${index + 1}`}
          aria-invalid={error}
        />
      ))}
    </div>
  );
}
