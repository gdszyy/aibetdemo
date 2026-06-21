'use client';

import { type ChangeEvent, type FC, useCallback, useEffect, useRef, useState } from 'react';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';

import { useRegionIntlLocale } from '@/i18nV2/store';
import { cn } from '@/utils/common';

export interface CurrencyInputProps {
    /** Current amount */
    value?: number;
    /** Amount change callback */
    onChange?: (value: number | undefined) => void;
    /** Focus callback */
    onFocus?: () => void;
    /** Blur callback */
    onBlur?: () => void;
    /** Minimum amount */
    min?: number;
    /** Maximum amount */
    max?: number;
    /** Whether disabled */
    disabled?: boolean;
    /** Error state */
    error?: boolean;
    /** Whether to allow decimals, default true */
    allowDecimals?: boolean;
    /** Custom class name */
    className?: string;
    /** Placeholder */
    placeholder?: string;
}

/**
 * Generic currency amount input component
 * Ported from StakeInput, supports i18n formatting, grouping separator handling, and input validation
 */
export const CurrencyInput: FC<CurrencyInputProps> = ({
    value,
    onChange,
    onFocus,
    onBlur,
    min = 0,
    max = Number.MAX_SAFE_INTEGER,
    disabled = false,
    error = false,
    allowDecimals = true,
    className,
    placeholder,
}) => {
    const { currencySymbolNarrow, decimalSeparator } = useIntlFormatter();
    const locale = useRegionIntlLocale();
    const inputRef = useRef<HTMLInputElement>(null);

    // Decimal places config
    const fractionDigits = allowDecimals ? 2 : 0;

    // Local display value (string) for handling intermediate states like "10." or "10,0"
    const [localValue, setLocalValue] = useState(() => {
        if (value === undefined || value === null) return '';
        // Initial display is typically unfocused state, with grouping separators
        return Intl.NumberFormat(locale, { maximumFractionDigits: fractionDigits }).format(value);
    });

    // Sync external value changes
    useEffect(() => {
        if (value === undefined || value === null) {
            setLocalValue('');
            return;
        }

        // Parse current local value, removing grouping separators (regardless of dot or comma)
        const currentLocalNum = Number.parseFloat(
            localValue.replace(decimalSeparator === ',' ? /\./g : /,/g, '').replace(decimalSeparator, '.'),
        );

        // Only update localValue when value actually changes, to avoid cursor jumping
        if (Math.abs(currentLocalNum - value) > 0.005 || Number.isNaN(currentLocalNum)) {
            // On external sync: with grouping separators when unfocused, without when focused
            const isFocused = document.activeElement === inputRef.current;
            setLocalValue(
                Intl.NumberFormat(locale, { maximumFractionDigits: fractionDigits, useGrouping: !isFocused }).format(
                    value,
                ),
            );
        }
    }, [value, locale, decimalSeparator, localValue, fractionDigits]);

    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const inputValue = e.target.value;

            if (inputValue === '') {
                setLocalValue('');
                onChange?.(undefined);
                return;
            }

            // Normalize decimal separator
            const normalizedValue = inputValue.replace(/[.,]/g, decimalSeparator);
            const escapedSeparator = decimalSeparator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

            // Build regex based on whether decimals are allowed
            const regex = allowDecimals ? new RegExp(`^\\d*(${escapedSeparator}\\d{0,2})?$`) : /^\d*$/;

            if (!regex.test(normalizedValue)) {
                return;
            }

            setLocalValue(normalizedValue);

            const standardValueString = normalizedValue.replace(decimalSeparator, '.');
            const numericValue = Number.parseFloat(standardValueString);

            if (Number.isNaN(numericValue)) {
                onChange?.(0);
                return;
            }

            // Don't clamp during input — defer to business layer or blur handler for better UX
            onChange?.(numericValue);
        },
        [onChange, decimalSeparator, allowDecimals],
    );

    const handleBlur = useCallback(() => {
        onBlur?.();
        if (value || value === 0) {
            // Clamp to min/max and format on blur
            const clampedValue = Math.max(min, Math.min(max, value));
            if (clampedValue !== value) {
                onChange?.(clampedValue);
            }
            // Add grouping separators on blur
            setLocalValue(Intl.NumberFormat(locale, { maximumFractionDigits: fractionDigits }).format(clampedValue));
        } else {
            setLocalValue('');
        }
    }, [onBlur, value, locale, min, max, onChange, fractionDigits]);

    const handleFocus = useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
            if (value || value === 0) {
                // Remove grouping separators on focus for easier editing
                setLocalValue(
                    Intl.NumberFormat(locale, { maximumFractionDigits: fractionDigits, useGrouping: false }).format(
                        value,
                    ),
                );
            }
            e.target.select();
            onFocus?.();
        },
        [onFocus, value, locale, fractionDigits],
    );

    return (
        <div
            className={cn(
                'flex items-center h-10 px-4 rounded-sm bg-filltext-ft-a border transition-all',
                error ? 'border-brand-red' : 'border-filltext-ft-d',
                !disabled && 'focus-within:border-neutral-black-h',
                disabled && 'opacity-50 cursor-not-allowed bg-filltext-ft-b',
                className,
            )}
            onClick={() => !disabled && inputRef.current?.focus()}
        >
            <span className="text-filltext-ft-e text-body-medium shrink-0">{currencySymbolNarrow}</span>
            <input
                ref={inputRef}
                type="text"
                inputMode="decimal"
                value={localValue}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                disabled={disabled}
                placeholder={placeholder}
                className={cn(
                    'ml-2 flex-1 bg-transparent text-body-medium text-filltext-ft-g',
                    disabled && 'cursor-not-allowed',
                )}
            />
        </div>
    );
};
