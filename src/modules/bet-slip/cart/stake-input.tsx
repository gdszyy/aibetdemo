'use client';

import { AnimatePresence, motion } from 'motion/react';
import { type ChangeEvent, type FC, useCallback, useEffect, useRef, useState } from 'react';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { useIsMobile } from '@/hooks/use-media-query';
import { useRegionIntlLocale } from '@/i18nV2/store';
import { cn } from '@/utils/common';
import { useMaxStake } from './_hooks/use-max-stake';
import { NumericKeypad } from './numeric-keypad';

export interface StakeInputProps {
    /** Current amount */
    value: number;
    /** Amount change callback */
    onChange?: (value: number) => void;
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
    /** Visually active/disabled state */
    variant?: 'default' | 'active' | 'quick-active' | 'locked' | 'invalid';
    /** Disable pointer interaction without changing the visual style */
    interactiveDisabled?: boolean;
    /** Hover preview amount shown inside input */
    hoverPreviewAmount?: number | null;
    /** Commit preview amount shown inside input */
    commitPreviewAmount?: number | null;
    /** Unique key to restart commit animation */
    commitPreviewNonce?: number | string | null;
    /** Unique key to flash input accent */
    inputFlashNonce?: number | string | null;
    /** Flash appearance variant */
    inputFlashVariant?: 'background' | 'outlined' | null;
    /** Unique key to animate displayed numeric value */
    valueAnimationNonce?: number | string | null;
    /** Commit preview animation completion callback */
    onCommitPreviewAnimationComplete?: (nonce: number | string) => void;
    /** Whether highlighted (red border) */
    highlighted?: boolean;
    /** Custom class name */
    className?: string;
}

/**
 * Stake amount input component.
 *
 * Features:
 * - Currency symbol display
 * - Min/max amount limits
 * - Numeric input validation
 * - Highlighted state (red border)
 */
export const StakeInput: FC<StakeInputProps> = ({
    value,
    onChange,
    onFocus,
    onBlur,
    min = 1,
    max: propMax,
    disabled = false,
    variant = 'default',
    interactiveDisabled = false,
    hoverPreviewAmount = null,
    commitPreviewAmount = null,
    commitPreviewNonce,
    inputFlashNonce = null,
    inputFlashVariant = null,
    valueAnimationNonce,
    onCommitPreviewAnimationComplete,
    highlighted = false,
    className,
}) => {
    const { currencySymbolNarrow, decimalSeparator } = useIntlFormatter();
    const locale = useRegionIntlLocale();
    // 移动端自绘键盘（betbus 形态，桌面端逻辑完全不变）
    const isMobile = useIsMobile();
    const [keypadOpen, setKeypadOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const valueAnimationFrameRef = useRef<number | null>(null);
    const isValueAnimatingRef = useRef(false);
    const prevValueRef = useRef(value);
    const prevValueAnimationNonceRef = useRef<number | string | null | undefined>(valueAnimationNonce);
    const [activeInputFlash, setActiveInputFlash] = useState<{
        nonce: number | string;
        variant: 'background' | 'outlined' | null;
    } | null>(null);
    const visualVariant = highlighted && variant === 'default' ? 'active' : variant;
    const usesDisabledVisual = visualVariant === 'locked' || visualVariant === 'invalid';
    const blocksInteraction = disabled || interactiveDisabled || usesDisabledVisual;
    const zeroLabel = Intl.NumberFormat(locale, { maximumFractionDigits: 2, useGrouping: false }).format(0);
    const hoverPreviewLabel =
        hoverPreviewAmount == null
            ? ''
            : `+${Intl.NumberFormat(locale, { maximumFractionDigits: 2, useGrouping: false }).format(hoverPreviewAmount)}`;
    const commitPreviewLabel =
        commitPreviewAmount == null
            ? ''
            : `+${Intl.NumberFormat(locale, { maximumFractionDigits: 2, useGrouping: false }).format(commitPreviewAmount)}`;
    const parseDisplayValue = useCallback(
        (displayValue: string) => {
            if (!displayValue) return 0;
            const normalizedValue = displayValue
                .replace(decimalSeparator === ',' ? /\./g : /,/g, '')
                .replace(decimalSeparator, '.');
            const parsedValue = Number.parseFloat(normalizedValue);
            return Number.isNaN(parsedValue) ? 0 : parsedValue;
        },
        [decimalSeparator],
    );
    const formatDisplayNumber = useCallback(
        (numericValue: number, roundToInteger = false) => {
            const displayValue = roundToInteger ? Math.round(numericValue) : numericValue;
            return Intl.NumberFormat(locale, {
                maximumFractionDigits: roundToInteger ? 0 : 2,
                useGrouping: false,
            }).format(displayValue);
        },
        [locale],
    );
    const getAnimationTone = useCallback((nonce: number | string | null | undefined) => {
        if (typeof nonce !== 'string') return 'default';
        if (nonce.startsWith('quick-')) return 'quick';
        if (nonce.startsWith('bulk-')) return 'bulk';
        return 'default';
    }, []);
    const stopValueAnimation = useCallback(() => {
        if (valueAnimationFrameRef.current != null) {
            cancelAnimationFrame(valueAnimationFrameRef.current);
            valueAnimationFrameRef.current = null;
        }
        isValueAnimatingRef.current = false;
    }, []);

    // TODO: Fetch from API later
    // Get system max limit
    const systemMax = useMaxStake();
    // Use the smaller of prop max and system limit
    const max = propMax !== undefined ? Math.min(propMax, systemMax) : systemMax;

    // Local display value (string) to handle intermediate states like "10." or "10,0"
    // Initialized as locale-formatted string; empty string if value is 0
    const [localValue, setLocalValue] = useState(() => {
        if (!value) return '';
        return Intl.NumberFormat(locale, { maximumFractionDigits: 2, useGrouping: false }).format(value);
    });

    useEffect(() => {
        const previousValue = prevValueRef.current;
        const shouldAnimateValue =
            valueAnimationNonce != null &&
            valueAnimationNonce !== prevValueAnimationNonceRef.current &&
            previousValue !== value;

        if (shouldAnimateValue) {
            const animationStartValue = isValueAnimatingRef.current ? parseDisplayValue(localValue) : previousValue;
            const shouldRoundToInteger = Number.isInteger(animationStartValue) && Number.isInteger(value);

            stopValueAnimation();
            isValueAnimatingRef.current = true;
            prevValueRef.current = value;
            prevValueAnimationNonceRef.current = valueAnimationNonce;

            const animationStartTime = performance.now();
            const animationTone = getAnimationTone(valueAnimationNonce);
            const animationDuration = (animationTone === 'quick' ? 0.24 : 0.42) * 1000;
            const step = (timestamp: number) => {
                const progress = Math.min((timestamp - animationStartTime) / animationDuration, 1);
                const easedProgress = 1 - (1 - progress) ** 3;
                const currentValue = animationStartValue + (value - animationStartValue) * easedProgress;

                setLocalValue(formatDisplayNumber(currentValue, shouldRoundToInteger));

                if (progress < 1) {
                    valueAnimationFrameRef.current = requestAnimationFrame(step);
                    return;
                }

                stopValueAnimation();
                setLocalValue(formatDisplayNumber(value, shouldRoundToInteger));
            };

            valueAnimationFrameRef.current = requestAnimationFrame(step);
            return;
        }

        if (prevValueAnimationNonceRef.current !== valueAnimationNonce) {
            prevValueAnimationNonceRef.current = valueAnimationNonce;
        }

        if (isValueAnimatingRef.current) return;

        // When external value changes significantly (not just formatting), sync localValue
        // Avoids interrupting user input (e.g., don't force "10." to become "10")
        if (!value) {
            setLocalValue('');
            prevValueRef.current = value;
            return;
        }

        // Try parsing current localValue as a number
        const currentLocalNum = parseDisplayValue(localValue);

        // Only update localValue when the numeric value truly changes, to avoid cursor jump or loss of intermediate state
        if (Math.abs(currentLocalNum - value) > 0.005 || Number.isNaN(currentLocalNum)) {
            setLocalValue(formatDisplayNumber(value));
        }
        prevValueRef.current = value;
    }, [
        value,
        valueAnimationNonce,
        localValue,
        parseDisplayValue,
        formatDisplayNumber,
        getAnimationTone,
        stopValueAnimation,
    ]);

    useEffect(() => stopValueAnimation, [stopValueAnimation]);

    useEffect(() => {
        if (inputFlashNonce == null) return;
        setActiveInputFlash({ nonce: inputFlashNonce, variant: inputFlashVariant });
    }, [inputFlashNonce, inputFlashVariant]);

    // Handle input change
    const handleChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            stopValueAnimation();
            const inputValue = e.target.value;

            // Empty value handling
            if (inputValue === '') {
                setLocalValue('');
                onChange?.(0);
                return;
            }

            // Normalize: replace "." or "," with current locale's decimal separator
            const normalizedValue = inputValue.replace(/[.,]/g, decimalSeparator);

            // Build regex: allow only digits and current locale's decimal separator (max 2 decimals)
            // Dynamically escape separator (e.g., '.' needs escaping to '\.')
            const escapedSeparator = decimalSeparator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            // Regex: starts with digits, optional separator + up to 2 digits
            const regex = new RegExp(`^\\d*(${escapedSeparator}\\d{0,2})?$`);

            if (!regex.test(normalizedValue)) {
                return;
            }

            setLocalValue(normalizedValue);

            // Parse to standard number (convert locale separator to .)
            const standardValueString = normalizedValue.replace(decimalSeparator, '.');
            const numericValue = Number.parseFloat(standardValueString);

            if (Number.isNaN(numericValue)) {
                // If it's NaN (e.g., just "."), treat as 0 for onChange
                onChange?.(0);
                return;
            }

            // Clamp to range
            const clampedValue = Math.max(min, Math.min(max, numericValue));

            onChange?.(clampedValue);
        },
        [onChange, decimalSeparator, max, min, stopValueAnimation],
    );

    // Format display on blur
    const handleBlur = useCallback(() => {
        onBlur?.();
        if (value) {
            setLocalValue(formatDisplayNumber(value));
        } else {
            setLocalValue('');
        }
    }, [onBlur, value, formatDisplayNumber]);

    // Select all text on focus
    const handleFocus = useCallback(
        (e: React.FocusEvent<HTMLInputElement>) => {
            e.target.select();
            onFocus?.();
        },
        [onFocus],
    );
    const isQuickBackgroundFlash = activeInputFlash?.variant === 'background';

    return (
        <>
            <div
                className={cn(
                    'group/stake-input relative flex h-8 items-center justify-between overflow-hidden rounded-sm border-[0.5px] px-2 transition-colors',
                    visualVariant === 'default' &&
                        'cursor-text border-[color:var(--slip-input-border,var(--border-strong))] bg-[var(--slip-input-bg,var(--surface-muted))] text-filltext-ft-e hover:border-[color:var(--slip-accent,var(--brand-primary-0))] hover:bg-[var(--slip-input-active-bg,var(--surface-2))] hover:text-filltext-ft-f focus-within:border-[color:var(--slip-accent,var(--brand-primary-0))] focus-within:bg-[var(--slip-input-active-bg,var(--surface-2))] focus-within:text-filltext-ft-f',
                    visualVariant === 'active' &&
                        'cursor-text border-[color:var(--slip-accent,var(--brand-primary-0))] bg-[var(--slip-input-active-bg,var(--surface-2))] text-filltext-ft-f',
                    visualVariant === 'quick-active' &&
                        'cursor-text border-[color:var(--slip-accent,var(--brand-primary-0))] bg-[var(--slip-input-active-bg,var(--surface-2))] text-filltext-ft-f',
                    visualVariant === 'locked' && 'border-transparent bg-neutral-black-a text-filltext-ft-e',
                    visualVariant === 'invalid' && 'border-transparent bg-neutral-black-a text-neutral-black-d',
                    blocksInteraction && 'pointer-events-none',
                    className,
                )}
                onClick={() => {
                    if (blocksInteraction) return;
                    if (isMobile) {
                        onFocus?.();
                        setKeypadOpen(true);
                    } else {
                        inputRef.current?.focus();
                    }
                }}
            >
                <AnimatePresence initial={false}>
                    {activeInputFlash != null && (
                        <motion.div
                            key={`flash-${activeInputFlash.nonce}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0.85, 0] }}
                            transition={{ duration: 0.34, times: [0, 0.25, 1], ease: 'easeOut' }}
                            onAnimationComplete={() =>
                                setActiveInputFlash((current) =>
                                    current?.nonce === activeInputFlash.nonce ? null : current,
                                )
                            }
                            className={cn(
                                'pointer-events-none absolute z-0 bg-brand-primary-1',
                                isQuickBackgroundFlash ? 'inset-[0.5px] rounded-[7.5px]' : 'inset-0 rounded-sm',
                                activeInputFlash.variant === 'outlined' &&
                                    'border-[0.5px] border-[color:var(--slip-accent,var(--brand-primary-0))]',
                            )}
                        />
                    )}
                </AnimatePresence>

                {hoverPreviewAmount != null && commitPreviewAmount == null && (
                    <div className="pointer-events-none absolute left-[18px] top-1/2 z-[9] -translate-y-1/2 text-auxiliary-md text-accent-warm max-md:hidden">
                        {hoverPreviewLabel}
                    </div>
                )}

                <AnimatePresence initial={false}>
                    {commitPreviewAmount != null && commitPreviewNonce != null && (
                        <motion.div
                            key={`commit-${commitPreviewNonce}`}
                            initial={{ opacity: 1, x: 0, color: 'var(--brand-primary-0)' }}
                            animate={{ opacity: [1, 1, 0], x: [0, 10, 14], color: 'var(--brand-primary-0)' }}
                            transition={{ duration: 0.18, times: [0, 0.45, 1], ease: 'easeOut' }}
                            onAnimationComplete={() => onCommitPreviewAnimationComplete?.(commitPreviewNonce)}
                            className="pointer-events-none absolute left-[12px] top-1/2 z-10 -translate-y-1/2 text-auxiliary-md max-md:left-auto max-md:right-[60px]"
                        >
                            {commitPreviewLabel}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Currency symbol */}
                <span
                    className={cn(
                        'relative z-[1] shrink-0 text-xs transition-colors',
                        visualVariant === 'default' && 'text-filltext-ft-f',
                        visualVariant === 'active' && 'text-[var(--slip-profit,var(--accent-warm))]',
                        visualVariant === 'quick-active' && 'text-[var(--slip-profit,var(--accent-warm))]',
                        visualVariant === 'locked' && 'text-filltext-ft-g',
                        visualVariant === 'invalid' && 'text-neutral-black-d',
                    )}
                >
                    {currencySymbolNarrow}
                </span>

                {/* Input field */}
                <input
                    ref={inputRef}
                    data-stake-input="true"
                    type="text"
                    inputMode="decimal"
                    value={localValue}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    disabled={usesDisabledVisual}
                    readOnly={disabled || interactiveDisabled || isMobile}
                    tabIndex={blocksInteraction ? -1 : undefined}
                    placeholder={zeroLabel}
                    className={cn(
                        'relative z-[1] w-full min-w-0 flex-1 bg-transparent text-right',
                        'text-auxiliary-sm font-poppins caret-filltext-ft-g',
                        visualVariant === 'default' && 'text-filltext-ft-h',
                        visualVariant === 'active' && 'text-[var(--slip-profit,var(--accent-warm))]',
                        visualVariant === 'quick-active' && 'text-[var(--slip-profit,var(--accent-warm))]',
                        visualVariant === 'locked' && 'text-filltext-ft-g',
                        visualVariant === 'invalid' && 'text-neutral-black-d',
                        'placeholder:text-current placeholder:opacity-100',
                    )}
                />
            </div>

            {isMobile && keypadOpen && (
                <NumericKeypad
                    value={value}
                    max={max}
                    onChange={(next) => onChange?.(next)}
                    onClose={() => {
                        setKeypadOpen(false);
                        onBlur?.();
                    }}
                />
            )}
        </>
    );
};
