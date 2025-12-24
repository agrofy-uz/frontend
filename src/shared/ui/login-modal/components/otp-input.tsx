import { useRef, useEffect, useState } from 'react';
import { TextInput } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';

interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  disabled,
  error = false,
}: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const isMobile = useMediaQuery('(max-width: 768px)');
  useEffect(() => {
    // Initialize with value if provided
    if (value) {
      const values = value.split('').slice(0, length);
      const newOtp = [...Array(length).fill('')];
      values.forEach((val, index) => {
        newOtp[index] = val;
      });
      setOtp(newOtp);
    } else {
      setOtp(Array(length).fill(''));
    }
  }, [value, length]);

  const handleChange = (index: number, inputValue: string) => {
    // Only allow digits
    if (inputValue && !/^\d$/.test(inputValue)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = inputValue;
    setOtp(newOtp);

    // Update parent component
    onChange(newOtp.join(''));

    // Auto-focus next input
    if (inputValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    const digits = pastedData.replace(/\D/g, '').slice(0, length).split('');

    if (digits.length > 0) {
      const newOtp = [...Array(length).fill('')];
      digits.forEach((digit, index) => {
        newOtp[index] = digit;
      });
      setOtp(newOtp);
      onChange(newOtp.join(''));

      // Focus last filled input or first empty
      const nextIndex = Math.min(digits.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: isMobile ? '6px' : '8px',
        justifyContent: 'center',
        flexWrap: 'nowrap',
      }}
    >
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          maxLength={1}
          size={isMobile ? 'md' : 'lg'}
          error={error}
          style={{
            width: isMobile ? '40px' : '48px',
            textAlign: 'center',
            fontSize: isMobile ? '18px' : '20px',
            fontWeight: 600,
          }}
          inputMode="numeric"
          pattern="[0-9]*"
        />
      ))}
    </div>
  );
}
