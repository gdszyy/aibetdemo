'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useDebounceFn } from 'ahooks';
import type { ChangeEvent, FC, RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';
import { GetSlipSettingsInterface, UpdateSlipSettingsInterface } from '@/api/handlers/cart';
import { OddsChangePolicy } from '@/api/models/cart';
import { IconButton } from '@/components/icon-button';
import { ArrowDoubleDown, ArrowRight, Close, Question } from '@/components/icons';
import { Modal } from '@/components/modal/modal';
import { Tooltip } from '@/components/tooltip/tooltip';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { useIsDesktop } from '@/hooks/use-media-query';
import { useIsLogin } from '@/stores/session-store';
import { type SlipSettingsGuideSection, useSlipSettingsStore } from '@/stores/slip-settings-store';
import { cn } from '@/utils/common';
import type { OddsFormat } from '../_utils';

const QUICK_AMOUNT_SLOTS = ['first', 'second', 'third'] as const;

const BETBUS_SETTINGS_TEXT = {
    loading: 'Cargando',
    title: 'Configuración',
    oddsChange: 'Cambios de cuotas',
    oddsFormat: 'Formato de cuotas',
    quickBuyAmountConfiguration: 'Compra rápida',
    quickBuyTooltip: 'Define importes rápidos para añadirlos al cupón.',
    showMoreOptions: 'Mostrar más opciones',
    oddsPolicy: {
        acceptAll: 'Aceptar todos los cambios de cuotas automáticamente',
        acceptHigher: 'Aceptar solo cuotas mejores',
        acceptNone: 'No aceptar cambios de cuotas',
        hints: {
            acceptAll: 'Confirma automáticamente cualquier cambio de cuota antes de realizar la apuesta.',
            acceptHigher: 'Confirma automáticamente si la cuota mejora. Si baja, pedirá confirmación.',
            acceptNone: 'Cualquier cambio de cuota requerirá confirmación manual.',
        },
    },
    format: {
        decimal: 'Decimal',
        american: 'Americano',
        fractional: 'Fraccionario',
    },
} as const;

export interface SlipSettingsProps {
    /** Back button click callback */
    onBack?: () => void;
    /** Custom class name */
    className?: string;
}

const SectionInfoTrigger: FC<{
    title: string;
    tooltip: string;
    isDesktop: boolean;
    onMobileTooltipOpen?: (title: string, content: string) => void;
}> = ({ title, tooltip, isDesktop, onMobileTooltipOpen }) => {
    if (isDesktop) {
        return (
            <Tooltip content={tooltip}>
                <IconButton
                    icon={Question}
                    size="xs"
                    variant="ghost"
                    shape="square"
                    className="text-filltext-ft-f hover:text-accent-warm"
                />
            </Tooltip>
        );
    }

    return (
        <IconButton
            icon={Question}
            size="xs"
            variant="ghost"
            shape="square"
            className="text-filltext-ft-f hover:text-accent-warm"
            onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onMobileTooltipOpen?.(title, tooltip);
            }}
        />
    );
};

const SettingsAmountInput: FC<{
    value: number;
    onChange: (value: number) => void;
    inputRef?: RefObject<HTMLInputElement | null>;
}> = ({ value, onChange, inputRef }) => {
    const { currencySymbolNarrow } = useIntlFormatter();
    const [localValue, setLocalValue] = useState(() => (value > 0 ? String(value) : ''));

    useEffect(() => {
        setLocalValue(value > 0 ? String(value) : '');
    }, [value]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const nextValue = event.target.value;

        if (!/^\d*$/.test(nextValue)) {
            return;
        }

        setLocalValue(nextValue);
        onChange(nextValue === '' ? 0 : Number(nextValue));
    };

    const handleBlur = () => {
        const normalizedValue = Math.max(1, Number.parseInt(localValue || '0', 10) || 0);
        setLocalValue(String(normalizedValue));
        onChange(normalizedValue);
    };

    return (
        <div
            className={cn(
                'flex h-8 min-w-0 items-center rounded-sm border border-border-strong bg-surface-muted px-2',
                'transition-colors focus-within:border-brand-primary-0 focus-within:bg-surface-2',
            )}
        >
            <span className="shrink-0 text-auxiliary-md text-accent-warm">{currencySymbolNarrow}</span>
            <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                value={localValue}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={(event) => event.target.select()}
                className={cn(
                    'ml-2 min-w-0 flex-1 bg-transparent text-right',
                    'text-auxiliary-md text-filltext-ft-h placeholder:text-filltext-ft-f',
                    'focus:text-accent-warm',
                )}
            />
        </div>
    );
};

const AmountSettingsSection: FC<{
    title: string;
    tooltip: string;
    amounts: number[];
    onAmountChange: (index: number, value: number) => void;
    firstInputRef?: RefObject<HTMLInputElement | null>;
    isDesktop: boolean;
    onMobileTooltipOpen?: (title: string, content: string) => void;
}> = ({ title, tooltip, amounts, onAmountChange, firstInputRef, isDesktop, onMobileTooltipOpen }) => {
    return (
        <div className="flex w-full flex-col gap-2">
            <div className="flex items-center gap-2">
                <span className="text-auxiliary-md font-bold text-filltext-ft-h">{title}</span>
                <SectionInfoTrigger
                    title={title}
                    tooltip={tooltip}
                    isDesktop={isDesktop}
                    onMobileTooltipOpen={onMobileTooltipOpen}
                />
            </div>

            <div className="grid w-full grid-cols-3 gap-2">
                {QUICK_AMOUNT_SLOTS.map((slot, index) => (
                    <SettingsAmountInput
                        key={slot}
                        value={amounts[index] ?? 0}
                        onChange={(nextValue) => onAmountChange(index, nextValue)}
                        inputRef={index === 0 ? firstInputRef : undefined}
                    />
                ))}
            </div>
        </div>
    );
};

/**
 * Radio button component.
 */
const RadioButton: FC<{
    checked: boolean;
    onChange: () => void;
    label: string;
    extraLabel?: string;
    tooltip?: string;
    isDesktop: boolean;
    onMobileTooltipOpen?: (title: string, content: string) => void;
    align?: 'start' | 'center';
    labelWeight?: 'regular' | 'semibold-active';
}> = ({
    checked,
    onChange,
    label,
    extraLabel,
    tooltip,
    isDesktop,
    onMobileTooltipOpen,
    align = 'center',
    labelWeight = 'regular',
}) => {
    const hasPinnedMobileTooltip = !isDesktop && Boolean(tooltip);

    return (
        <div
            className={cn(
                hasPinnedMobileTooltip
                    ? 'grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-2'
                    : 'flex w-full gap-2',
                !hasPinnedMobileTooltip && (align === 'start' && isDesktop ? 'items-start' : 'items-center'),
            )}
        >
            <button
                type="button"
                onClick={onChange}
                className={cn(
                    'flex min-w-0 cursor-pointer gap-1 text-left',
                    hasPinnedMobileTooltip && 'w-full',
                    align === 'start' && isDesktop ? 'items-start' : 'items-center',
                )}
            >
                {/* Radio circle (fine-tuned alignment) */}
                <span
                    className={cn(
                        'flex size-3.5 shrink-0 items-center justify-center rounded-full border-[1.6px] transition-colors',
                        checked ? 'border-brand-primary-0' : 'border-filltext-ft-f',
                    )}
                >
                    {checked && <span className="size-1.5 rounded-full bg-brand-red" />}
                </span>
                {/* Label container */}
                <div className={cn('min-w-0 flex', extraLabel ? 'items-center gap-2.5' : 'flex-col')}>
                    <span
                        className={cn(
                            'min-w-0 whitespace-pre-wrap text-left transition-colors',
                            labelWeight === 'semibold-active'
                                ? cn('text-auxiliary-md', checked ? 'text-filltext-ft-h' : 'text-filltext-ft-f')
                                : cn('text-auxiliary-sm', checked ? 'text-filltext-ft-h' : 'text-filltext-ft-f'),
                        )}
                    >
                        {label}
                    </span>
                    {extraLabel && (
                        <span className="text-auxiliary-sm leading-[14px] text-filltext-ft-f whitespace-nowrap">
                            {extraLabel}
                        </span>
                    )}
                </div>
            </button>

            {/* Tooltip icon — follows right after text */}
            {tooltip &&
                (isDesktop ? (
                    <Tooltip content={tooltip}>
                        <IconButton
                            icon={Question}
                            size="xs"
                            variant="ghost"
                            shape="square"
                            className={cn(
                                'text-filltext-ft-f hover:text-accent-warm',
                                align === 'start' && 'mt-[1.5px]',
                            )}
                        />
                    </Tooltip>
                ) : (
                    <IconButton
                        icon={Question}
                        size="xs"
                        variant="ghost"
                        shape="square"
                        className="text-filltext-ft-f hover:text-accent-warm"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            onMobileTooltipOpen?.(label, tooltip);
                        }}
                    />
                ))}
        </div>
    );
};

/**
 * Bet slip settings panel.
 *
 * Contains:
 * - Odds change acceptance policy
 */
export const SlipSettings: FC<SlipSettingsProps> = ({ onBack, className }) => {
    const queryClient = useQueryClient();
    const isLogin = useIsLogin();
    const isDesktop = useIsDesktop();

    const [mobileTooltipOpen, setMobileTooltipOpen] = useState(false);
    const [mobileTooltipTitle, setMobileTooltipTitle] = useState('');
    const [mobileTooltipContent, setMobileTooltipContent] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);

    const hasInitializedFromServerRef = useRef(false);
    const latestRequestedPolicyRef = useRef<OddsChangePolicy | null>(null);

    // Use store for state management
    const oddsChangePolicy = useSlipSettingsStore((state) => state.oddsChangePolicy);
    const setOddsChangePolicy = useSlipSettingsStore((state) => state.setOddsChangePolicy);
    const oddsFormat = useSlipSettingsStore((state) => state.oddsFormat);
    const setOddsFormat = useSlipSettingsStore((state) => state.setOddsFormat);
    const quickBuyAmounts = useSlipSettingsStore((state) => state.quickBuyAmounts);
    const setQuickBuyAmounts = useSlipSettingsStore((state) => state.setQuickBuyAmounts);
    const markGuideSectionCustomized = useSlipSettingsStore((state) => state.markGuideSectionCustomized);
    const isSettingsOpen = useSlipSettingsStore((state) => state.isSettingsOpen);
    const focusedSettingsSection = useSlipSettingsStore((state) => state.focusedSettingsSection);
    const settingsFocusRequestNonce = useSlipSettingsStore((state) => state.settingsFocusRequestNonce);
    // Fetch cart settings (only when logged in)
    const { data: cartSettings, isLoading } = useQuery({
        queryKey: ['cart-settings'],
        queryFn: () => GetSlipSettingsInterface(),
        enabled: isLogin, // Only call API when logged in
    });

    const quickBuySectionRef = useRef<HTMLDivElement>(null);
    const quickBuyFirstInputRef = useRef<HTMLInputElement>(null);
    const [highlightedSection, setHighlightedSection] = useState<SlipSettingsGuideSection | null>(null);

    useEffect(() => {
        if (!isSettingsOpen) {
            setIsExpanded(false);
        }
    }, [isSettingsOpen]);

    // Sync server config to store after successful load
    useEffect(() => {
        // Only initialize from server once.
        // After user starts interacting, avoid query/mutation races that can "bounce" selection back.
        if (isLogin && cartSettings?.odds_change !== undefined && !hasInitializedFromServerRef.current) {
            setOddsChangePolicy(cartSettings.odds_change);
            hasInitializedFromServerRef.current = true;
        }
    }, [isLogin, cartSettings?.odds_change, setOddsChangePolicy]);

    // Update cart settings
    const updateMutation = useMutation({
        mutationFn: (settings: { odds_change: OddsChangePolicy }) => UpdateSlipSettingsInterface(settings),
        onSuccess: (_, variables) => {
            // After success, sync to store
            if (latestRequestedPolicyRef.current === variables.odds_change) {
                setOddsChangePolicy(variables.odds_change);
            }
            // Invalidate query and refetch
            queryClient.invalidateQueries({ queryKey: ['cart-settings'] });
        },
    });

    // Debounce API calls
    const { run: debouncedUpdate } = useDebounceFn(
        (policy: OddsChangePolicy) => {
            updateMutation.mutate({ odds_change: policy });
        },
        { wait: 500 },
    );

    // Set odds change policy
    const handleSetOddsChangePolicy = (policy: OddsChangePolicy) => {
        // 1. Update store first (immediate effect — Optimistic UI)
        hasInitializedFromServerRef.current = true;
        latestRequestedPolicyRef.current = policy;
        setOddsChangePolicy(policy);

        if (isLogin) {
            // 2. Logged in: debounced update to server
            debouncedUpdate(policy);
        }
    };

    const handleQuickBuyAmountChange = (index: number, value: number) => {
        if (quickBuyAmounts[index] !== value) {
            markGuideSectionCustomized('quickBuy');
        }
        setQuickBuyAmounts(quickBuyAmounts.map((amount, amountIndex) => (amountIndex === index ? value : amount)));
    };

    useEffect(() => {
        if (!isSettingsOpen || focusedSettingsSection == null || settingsFocusRequestNonce === 0) {
            return;
        }

        if (!isExpanded) {
            setIsExpanded(true);
            return;
        }

        const targetElement = quickBuySectionRef.current;

        if (!targetElement) {
            return;
        }

        let highlightTimeoutId: number | null = null;
        let focusFrameId: number | null = null;
        const frameId = window.requestAnimationFrame(() => {
            const firstInputElement = quickBuyFirstInputRef.current;

            targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
            setHighlightedSection(focusedSettingsSection);
            focusFrameId = window.requestAnimationFrame(() => {
                firstInputElement?.focus({ preventScroll: true });
                firstInputElement?.select();
            });
            highlightTimeoutId = window.setTimeout(() => {
                setHighlightedSection((current) => (current === focusedSettingsSection ? null : current));
            }, 1800);
        });

        return () => {
            window.cancelAnimationFrame(frameId);
            if (focusFrameId != null) {
                window.cancelAnimationFrame(focusFrameId);
            }
            if (highlightTimeoutId != null) {
                window.clearTimeout(highlightTimeoutId);
            }
        };
    }, [focusedSettingsSection, isExpanded, isSettingsOpen, settingsFocusRequestNonce]);

    /** Odds change policy config */
    const ODDS_CHANGE_POLICIES: { value: OddsChangePolicy; label: string; tooltip: string }[] = [
        {
            value: OddsChangePolicy.Any,
            label: BETBUS_SETTINGS_TEXT.oddsPolicy.acceptAll,
            tooltip: BETBUS_SETTINGS_TEXT.oddsPolicy.hints.acceptAll,
        },
        {
            value: OddsChangePolicy.Higher,
            label: BETBUS_SETTINGS_TEXT.oddsPolicy.acceptHigher,
            tooltip: BETBUS_SETTINGS_TEXT.oddsPolicy.hints.acceptHigher,
        },
        {
            value: OddsChangePolicy.None,
            label: BETBUS_SETTINGS_TEXT.oddsPolicy.acceptNone,
            tooltip: BETBUS_SETTINGS_TEXT.oddsPolicy.hints.acceptNone,
        },
    ];

    /** Odds format config */
    const ODDS_FORMATS = [
        { value: 'decimal', label: BETBUS_SETTINGS_TEXT.format.decimal, extra: '(2.50)' },
        { value: 'american', label: BETBUS_SETTINGS_TEXT.format.american, extra: '(+150)' },
        { value: 'fractional', label: BETBUS_SETTINGS_TEXT.format.fractional, extra: '(3/2)' },
    ];

    // Loading state (shown only when logged in)
    if (isLogin && isLoading) {
        return (
            <div
                className={cn(
                    'flex flex-col items-center border border-border-subtle bg-page-bg p-4',
                    isDesktop
                        ? 'max-h-full w-[288px] overflow-y-auto overscroll-contain rounded-tl-sm rounded-bl-sm shadow-floating'
                        : 'w-full overflow-hidden rounded-sm',
                    className,
                )}
            >
                <div className="flex items-center justify-center py-8">
                    <span className="text-body-sm text-filltext-ft-f">{BETBUS_SETTINGS_TEXT.loading}</span>
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                'flex flex-col items-center border border-border-subtle bg-page-bg p-4',
                isDesktop
                    ? 'max-h-full w-[288px] overflow-y-auto overscroll-contain rounded-tl-sm rounded-bl-sm shadow-floating'
                    : 'w-full gap-6 overflow-hidden rounded-sm',
                className,
            )}
        >
            {/* Title bar */}
            <div
                className={cn(
                    'flex h-[30px] w-full items-center overflow-hidden',
                    isDesktop ? 'justify-between' : 'justify-center',
                )}
            >
                {/* Back button */}
                {isDesktop && (
                    <button
                        type="button"
                        onClick={onBack}
                        className="flex size-7 cursor-pointer items-center justify-center rounded-sm bg-surface-selected text-filltext-ft-f transition-colors hover:bg-brand-primary-0 hover:text-neutral-white-h"
                    >
                        <ArrowRight className="size-3" />
                    </button>
                )}
                {/* Title — centered */}
                <span className="text-body-md font-bold text-filltext-ft-h">{BETBUS_SETTINGS_TEXT.title}</span>
                {/* Right spacer to ensure perfect centering */}
                {isDesktop && <div className="size-3 shrink-0" />}
            </div>

            {/* Odds change settings */}
            <div className={cn('flex w-full flex-col gap-2', isDesktop && 'mt-6')}>
                <span className="text-auxiliary-md font-bold text-filltext-ft-h">
                    {BETBUS_SETTINGS_TEXT.oddsChange}
                </span>
                <div className="flex flex-col gap-2">
                    {ODDS_CHANGE_POLICIES.map((policy) => (
                        <RadioButton
                            key={policy.value}
                            checked={oddsChangePolicy === policy.value}
                            onChange={() => handleSetOddsChangePolicy(policy.value)}
                            label={policy.label}
                            tooltip={policy.tooltip}
                            isDesktop={isDesktop}
                            onMobileTooltipOpen={(title, content) => {
                                setMobileTooltipTitle(title);
                                setMobileTooltipContent(content);
                                setMobileTooltipOpen(true);
                            }}
                            labelWeight="regular"
                        />
                    ))}
                </div>
            </div>

            <div
                className={cn(
                    'grid -mx-2 px-2 overflow-hidden transition-all duration-300 ease-out',
                    isExpanded && 'mt-6',
                    isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                )}
            >
                <div className="min-h-0 flex flex-col">
                    {/* Odds format settings */}
                    <div className="flex flex-col gap-2">
                        <span className="text-auxiliary-md font-bold text-filltext-ft-h">
                            {BETBUS_SETTINGS_TEXT.oddsFormat}
                        </span>
                        <div className="flex flex-col gap-2">
                            {ODDS_FORMATS.map((format) => (
                                <RadioButton
                                    key={format.value}
                                    checked={oddsFormat === format.value}
                                    onChange={() => setOddsFormat(format.value as OddsFormat)}
                                    label={format.label}
                                    extraLabel={format.extra}
                                    isDesktop={isDesktop}
                                    onMobileTooltipOpen={(title, content) => {
                                        setMobileTooltipTitle(title);
                                        setMobileTooltipContent(content);
                                        setMobileTooltipOpen(true);
                                    }}
                                    align="center"
                                    labelWeight="semibold-active"
                                />
                            ))}
                        </div>
                    </div>

                    <div className="mt-4">
                        <div
                            ref={quickBuySectionRef}
                            className={cn(
                                '-mx-2 scroll-mt-4 rounded-sm px-2 py-2 transition-all duration-300',
                                highlightedSection === 'quickBuy' &&
                                    'bg-brand-primary-0/5 ring-1 ring-inset ring-brand-primary-0/40',
                            )}
                        >
                            <AmountSettingsSection
                                title={BETBUS_SETTINGS_TEXT.quickBuyAmountConfiguration}
                                tooltip={BETBUS_SETTINGS_TEXT.quickBuyTooltip}
                                amounts={quickBuyAmounts}
                                onAmountChange={handleQuickBuyAmountChange}
                                firstInputRef={quickBuyFirstInputRef}
                                isDesktop={isDesktop}
                                onMobileTooltipOpen={(title, content) => {
                                    setMobileTooltipTitle(title);
                                    setMobileTooltipContent(content);
                                    setMobileTooltipOpen(true);
                                }}
                            />
                        </div>
                    </div>

                    {/* Bottom spacing to prevent tight layout */}
                    <div className="h-4 shrink-0" />
                </div>
            </div>
            {!isExpanded && (
                <button
                    type="button"
                    onClick={() => setIsExpanded((current) => !current)}
                    className={cn(
                        'flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-sm border border-border-strong bg-surface-selected px-4 text-body-lg font-bold text-filltext-ft-h transition-colors hover:border-brand-primary-0 hover:bg-surface-2',
                        isDesktop && 'mt-6 text-auxiliary-md',
                    )}
                >
                    <ArrowDoubleDown className={cn('size-5 transition-transform', isDesktop && 'size-3')} />
                    <span>{BETBUS_SETTINGS_TEXT.showMoreOptions}</span>
                </button>
            )}

            {/* Mobile tooltip modal (button-driven, consistent with other mobile UX) */}
            <Modal
                visible={mobileTooltipOpen}
                onClose={() => setMobileTooltipOpen(false)}
                withBg={false}
                closeButton={false}
                blur
                maskClosable
            >
                <div className="relative w-[calc(100vw-2rem)] max-w-[308px] overflow-hidden rounded-sm border border-border-subtle bg-page-bg px-6 pt-8 pb-8 shadow-floating">
                    <button
                        type="button"
                        onClick={() => setMobileTooltipOpen(false)}
                        className="absolute right-3 top-3 inline-flex size-3.5 cursor-pointer items-center justify-center text-filltext-ft-e transition-colors hover:text-filltext-ft-g"
                    >
                        <Close className="size-3.5" />
                    </button>

                    <div className="flex flex-col gap-3 text-left">
                        <p className="text-auxiliary-md text-filltext-ft-g whitespace-pre-wrap">{mobileTooltipTitle}</p>
                        <p className="text-auxiliary-sm text-filltext-ft-g whitespace-pre-wrap">
                            {mobileTooltipContent}
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
