'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { useSlipSettingsStore } from '@/stores/slip-settings-store';
import { cn } from '@/utils/common';
import { SettingsGuideTooltip } from './settings-guide-tooltip';

const BET_ON_ALL_AMOUNT_SLOTS = ['first', 'second', 'third'] as const;

export interface BetOnAllButtonGroupProps {
    label: string;
    amounts: number[];
    onSelect?: (amount: number) => void;
    disabled?: boolean;
    className?: string;
}

export const BetOnAllButtonGroup: FC<BetOnAllButtonGroupProps> = ({
    label,
    amounts,
    onSelect,
    disabled = false,
    className,
}) => {
    const t = useTranslations('betSlip');
    const showBetOnAllGuide = useSlipSettingsStore(
        (state) => !state.hasCustomizedQuickBuyAmounts && !state.quickBuyGuideDismissed,
    );

    return (
        <SettingsGuideTooltip
            section="quickBuy"
            tooltip={t('guide.betOnAll.tooltip')}
            ctaLabel={t('guide.betOnAll.cta')}
            show={showBetOnAllGuide}
        >
            <div className={cn('flex h-16 w-full flex-col gap-1 px-4 pb-3', className)}>
                <span className="text-auxiliary-md text-filltext-ft-g">{label}</span>

                <div className="flex w-full items-center justify-between gap-2 overflow-hidden max-md:justify-start">
                    {BET_ON_ALL_AMOUNT_SLOTS.map((slot, index) => {
                        const amount = amounts[index];

                        if (amount == null) return null;

                        return (
                            <button
                                key={slot}
                                type="button"
                                onClick={() => onSelect?.(amount)}
                                disabled={disabled}
                                className={cn(
                                    'flex h-8 w-[75px] shrink-0 items-center justify-center rounded-sm px-2 max-md:w-auto max-md:flex-1 max-md:basis-0',
                                    'text-auxiliary-sm leading-4 font-poppins',
                                    'bg-[var(--slip-quick-bg,var(--filltext-ft-a))] text-filltext-ft-g transition-colors',
                                    'cursor-pointer hover:bg-[var(--slip-quick-hover-bg,var(--brand-primary-1))] hover:text-[var(--slip-quick-hover-text,var(--brand-primary-0))]',
                                    'active:bg-[var(--slip-accent,var(--brand-primary-0))] active:text-neutral-white-h',
                                    'disabled:cursor-not-allowed disabled:bg-neutral-black-a disabled:text-neutral-black-d',
                                    'disabled:hover:bg-neutral-black-a disabled:hover:text-neutral-black-d',
                                    'disabled:active:bg-neutral-black-a disabled:active:text-neutral-black-d',
                                )}
                            >
                                +{amount}
                            </button>
                        );
                    })}
                </div>
            </div>
        </SettingsGuideTooltip>
    );
};
