'use client';

import { useTranslations } from 'next-intl';
import { type FC, memo, useEffect, useRef, useState } from 'react';
import { match, P } from 'ts-pattern';
import { useIsDesktop } from '@/hooks/use-media-query';
import type { OddsEntity } from '@/modules/match/_constants/match.types';
import { useOddsDisplay } from '@/modules/match/_hooks/use-odds-display';
import { useSlipSettingsStore } from '@/stores/slip-settings-store';
import { isNullish } from '@/utils/common';
import { SettingsGuideTooltip } from './_components/settings-guide-tooltip';
import { QuickStakeButton } from './quick-stake-button';
import { StakeCard } from './stake-card';
import { StakeInput } from './stake-input';

export interface SingleStakeCardProps {
    stake: number | undefined;
    value: OddsEntity;
    /** Stake change callback */
    onStakeChange?: (value: number) => void;
    /** Shared nonce for Bet On all animations */
    bulkAnimationNonce?: number;
    /** Whether settlement is in progress */
    isPending?: boolean;
    className?: string;
}

/**
 * Stake card component.
 *
 * Supports two modes:
 * - Single mode: has stake input and quick buttons
 * - Parlay mode: no input, shows only match info and odds
 *
 * States:
 * - locked: market suspended, shows lock icon, grey background
 * - invalid: market invalidated, semi-transparent
 * - Odds change: up shows green arrow, down shows red arrow
 */
export const SingleStakeCard: FC<SingleStakeCardProps> = memo(
    ({ stake = 0, value, onStakeChange, bulkAnimationNonce, isPending = false, className }) => {
        const t = useTranslations('betSlip');
        const quickBuyAmounts = useSlipSettingsStore((s) => s.quickBuyAmounts);
        const isDesktop = useIsDesktop();
        const showQuickBuyGuide = useSlipSettingsStore(
            (state) => !state.hasCustomizedQuickBuyAmounts && !state.quickBuyGuideDismissed,
        );
        const { isInvalid, isLocked } = useOddsDisplay(value);

        // Input focus state
        const [isFocused, setIsFocused] = useState(false);
        const [isQuickButtonsHovered, setIsQuickButtonsHovered] = useState(false);
        const [hoveredQuickAmount, setHoveredQuickAmount] = useState<number | null>(null);
        const [committingQuickPreview, setCommittingQuickPreview] = useState<{ amount: number; nonce: number } | null>(
            null,
        );
        const commitPreviewNonceRef = useRef(0);
        const consumedBulkAnimationNonceRef = useRef<number | undefined>(undefined);

        // Calculate potential return (safe multiply to avoid precision issues)
        // const toReturn = useMemo(() => {
        //     if (stake <= 0) return 0;
        //     return safeMultiply(stake, odds);
        // }, [odds, stake]);

        // Figma keeps the quick amount row visible for default, active, pending, and invalid states.
        const showQuickButtons = !isLocked;
        const hasInteractiveHighlight = isFocused || isQuickButtonsHovered;
        const normalizedQuickPreview = isNullish(committingQuickPreview) ? null : committingQuickPreview;
        const normalizedBulkAnimationNonce = bulkAnimationNonce ?? 0;
        const hasBulkAnimation =
            normalizedBulkAnimationNonce > 0 && bulkAnimationNonce !== consumedBulkAnimationNonceRef.current;
        const stakeInputVariant = match({ isInvalid, isLocked, hasInteractiveHighlight })
            .returnType<'default' | 'active' | 'locked' | 'invalid'>()
            .with({ isInvalid: true }, () => 'invalid')
            .with({ isLocked: true }, () => 'locked')
            .with({ hasInteractiveHighlight: true }, () => 'active')
            .otherwise(() => 'default');
        const disableStakeControls = isPending || isInvalid;
        const { inputAnimationNonce, inputFlashNonce, inputFlashVariant } = match({
            preview: normalizedQuickPreview,
            hasBulkAnimation,
            bulkAnimationNonce: normalizedBulkAnimationNonce,
        })
            .returnType<{
                inputAnimationNonce: string | null;
                inputFlashNonce: string | null;
                inputFlashVariant: 'background' | 'outlined' | null;
            }>()
            .with({ preview: null, hasBulkAnimation: true }, ({ bulkAnimationNonce }) => {
                const bulkAnimationKey = `bulk-${bulkAnimationNonce}`;
                return {
                    inputAnimationNonce: bulkAnimationKey,
                    inputFlashNonce: bulkAnimationKey,
                    inputFlashVariant: 'outlined',
                };
            })
            .with({ preview: null }, () => ({
                inputAnimationNonce: null,
                inputFlashNonce: null,
                inputFlashVariant: null,
            }))
            .with({ preview: { amount: P.number, nonce: P.number } }, ({ preview, bulkAnimationNonce }) => {
                const quickAnimationKey = `quick-${preview.nonce}-${bulkAnimationNonce}`;
                return {
                    inputAnimationNonce: quickAnimationKey,
                    inputFlashNonce: quickAnimationKey,
                    inputFlashVariant: 'background',
                };
            })
            .exhaustive();
        // Show potential return: when not focused and value > 0
        // const showToReturn = !isFocused && stake > 0;

        useEffect(() => {
            if (!hasBulkAnimation) return;
            consumedBulkAnimationNonceRef.current = bulkAnimationNonce;
        }, [hasBulkAnimation, bulkAnimationNonce]);

        // Handle quick amount click
        const handleQuickAmount = (amount: number) => {
            if (disableStakeControls || isLocked) return;
            commitPreviewNonceRef.current += 1;
            setCommittingQuickPreview({ amount, nonce: commitPreviewNonceRef.current });
            onStakeChange?.(stake + amount);
        };

        // Handle stake input change
        const handleInputChange = (value: number) => {
            if (disableStakeControls || isLocked) return;
            onStakeChange?.(value);
        };

        return (
            <StakeCard value={value} className={className} isPending={isPending} compact={isDesktop}>
                {/* Bet info */}
                <div className="flex items-center gap-2.5 max-md:flex-col max-md:items-stretch max-md:gap-2">
                    {/* Stake input */}
                    <StakeInput
                        value={stake}
                        onChange={handleInputChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        variant={stakeInputVariant}
                        interactiveDisabled={isPending}
                        hoverPreviewAmount={hoveredQuickAmount}
                        commitPreviewAmount={committingQuickPreview?.amount}
                        commitPreviewNonce={committingQuickPreview?.nonce}
                        inputFlashNonce={inputFlashNonce}
                        inputFlashVariant={inputFlashVariant}
                        valueAnimationNonce={inputAnimationNonce}
                        onCommitPreviewAnimationComplete={(nonce) =>
                            setCommittingQuickPreview((current) => (current?.nonce === nonce ? null : current))
                        }
                        className="h-8 w-full shrink-0 md:h-7 md:w-[78px]"
                    />

                    {/* Quick stake options */}
                    {showQuickButtons && (
                        <SettingsGuideTooltip
                            section="quickBuy"
                            tooltip={t('guide.quickBuy.tooltip')}
                            ctaLabel={t('guide.quickBuy.cta')}
                            show={showQuickBuyGuide}
                            className="max-w-[252px]"
                        >
                            <div
                                className="flex flex-1 items-center justify-end gap-0.5 max-md:w-full max-md:flex-none max-md:justify-between"
                                onMouseEnter={() => setIsQuickButtonsHovered(true)}
                                onMouseLeave={() => {
                                    setIsQuickButtonsHovered(false);
                                    setHoveredQuickAmount(null);
                                }}
                            >
                                {quickBuyAmounts.map((amount) => (
                                    <QuickStakeButton
                                        key={amount}
                                        amount={amount}
                                        onClick={() => handleQuickAmount(amount)}
                                        onHoverStart={() => setHoveredQuickAmount(amount)}
                                        onHoverEnd={() => {
                                            setHoveredQuickAmount((current) => (current === amount ? null : current));
                                        }}
                                        variant={
                                            isInvalid ? 'invalid' : hoveredQuickAmount === amount ? 'active' : 'default'
                                        }
                                        interactiveDisabled={disableStakeControls}
                                        className="md:h-7 md:w-[38px] md:px-0 md:py-1 max-md:w-auto max-md:basis-0 max-md:flex-1"
                                    />
                                ))}
                            </div>
                        </SettingsGuideTooltip>
                    )}

                    {/* Potential return — shown when unfocused and value > 0, right-aligned vertical layout */}
                    {/* {showToReturn && (
                        <div className="flex flex-1 flex-col items-end justify-center leading-[0]">
                            <span
                                className={cn(
                                    'text-auxiliary-sm',
                                    isPending ? 'text-filltext-ft-e' : 'text-filltext-ft-g',
                                )}
                            >
                                {t('label.toReturn')}
                            </span>
                            <span
                                title={formatNumber(toReturn)}
                                className={cn('text-body-lg', isPending ? 'text-filltext-ft-e' : 'text-filltext-ft-g')}
                            >
                                {currencySymbolNarrow}
                                {formatCompactAmount(toReturn)}
                            </span>
                        </div>
                    )} */}
                </div>
            </StakeCard>
        );
    },
);

SingleStakeCard.displayName = 'SingleStakeCard';
