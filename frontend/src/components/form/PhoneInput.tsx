'use client';

import { useEffect, useRef } from 'react';
import 'intl-tel-input/styles';

// Light background default class (DynamicForm)
export const phoneInputCls =
  'w-full border px-3 py-2.5 text-sm text-gray-900 bg-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors rounded-sm';

interface PhoneInputProps {
  fieldName: string;
  placeholder?: string;
  hasError?: boolean;
  /** Tailwind border class override */
  borderClass?: string;
  /**
   * Inline style override — dark background için kullan.
   * Verilirse className tamamen devre dışı kalır, sadece style uygulanır.
   * intl-tel-input flag container'ı da bu style'a göre render eder.
   */
  inputStyle?: React.CSSProperties;
  onChange: (fullNumber: string) => void;
}

export default function PhoneInput({
  fieldName,
  placeholder = 'Phone',
  hasError = false,
  borderClass,
  inputStyle,
  onChange,
}: PhoneInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isMounted = true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let instance: any = null;
    if (!inputRef.current) return;

    import('intl-tel-input/intlTelInputWithUtils').then((mod) => {
      if (!isMounted || !inputRef.current) return;
      const intlTelInput = mod.default;
      instance = intlTelInput(inputRef.current, {
        countryOrder: ['tr', 'us'],
        separateDialCode: true,
        initialCountry: 'tr',
      });

      const notify = () => {
        if (!instance) return;
        onChange(instance.getNumber() ?? '');
      };

      inputRef.current.addEventListener('input', notify);
      inputRef.current.addEventListener('countrychange', () => {
        if (inputRef.current) inputRef.current.value = '';
        notify();
      });
    });

    return () => {
      isMounted = false;
      if (instance) instance.destroy();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dark mode: inputStyle verilmişse className kullanma, sadece style uygula
  if (inputStyle) {
    return (
      <input
        ref={inputRef}
        id={`iti-${fieldName}`}
        type="tel"
        placeholder={placeholder}
        autoComplete="off"
        style={{
          ...inputStyle,
          borderColor: hasError ? '#f87171' : inputStyle.borderColor,
        }}
      />
    );
  }

  // Light mode: Tailwind className kullan
  const border = borderClass ?? (hasError ? 'border-red-500' : 'border-gray-300');
  return (
    <input
      ref={inputRef}
      id={`iti-${fieldName}`}
      type="tel"
      placeholder={placeholder}
      autoComplete="off"
      className={`${phoneInputCls} ${border}`}
    />
  );
}