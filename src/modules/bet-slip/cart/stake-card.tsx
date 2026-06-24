'use client';

import { type FC, memo, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { AtOdds, CloseBold, OddsLock, TimePending, TrendDownSolid, TrendUpSolid, Warn } from '@/components/icons';
import { useThemeComponentProfile } from '@/components/theme-provider/component-profile';
import { ConditionalTooltip } from '@/components/tooltip';
import { useIsDesktop } from '@/hooks/use-media-query';
import { DRAWER_CARD_WIDTH } from '@/modules/bet-slip/_constants/constants';
import type { OddsEntity } from '@/modules/match/_constants/match.types';
import { useOddsDisplay } from '@/modules/match/_hooks/use-odds-display';
import { useOddsFormat } from '@/stores/slip-settings-store';
import { cn } from '@/utils/common';
import { formatOddsByFormat, getFullOddsByFormat, hasOddsExtraPrecision } from '@/utils/odds-format';
import { getOutcomeDisplayName } from '@/utils/outcome-display';
import { useBetSlipStore } from '../stores/bet-slip-store';

/** Odds change trend */
export type OddsTrend = 'up' | 'down' | null;
export type StakeCardWarningType = 'conflict' | 'non-compliant';

type StakeCardSurfaceState = 'invalid' | 'locked' | 'pending' | 'normal';

interface StakeCardStyleStrategy {
    container: string;
    removeButton: string;
    removeIcon: string;
    title: string;
    outcome: string;
    event: string;
    topInfo: string;
}

interface StakeCardViewModel {
    surfaceState: StakeCardSurfaceState;
    hasWarning: boolean;
    hasWarningHover: boolean;
    showLockedIcon: boolean;
    showOdds: boolean;
    showChildren: boolean;
    containerClassName: string;
    removeButtonClassName: string;
    removeIconClassName: string;
    topInfoClassName: string;
    titleClassName: string;
    outcomeClassName: string;
    eventClassName: string;
    oddsClassName: string;
}

type StakeCardInfoKey = 'market' | 'outcome' | 'event';

interface StakeCardInfoRow {
    key: StakeCardInfoKey;
    text: string;
}

const STAKE_CARD_CONTAINER_BASE_CLASS =
    'group relative flex items-stretch pl-0 overflow-hidden flex-none w-full rounded-sm border border-[color:var(--slip-card-border,var(--border-subtle))]';
const STAKE_CARD_REMOVE_BUTTON_BASE_CLASS =
    'group/remove-button flex w-8 shrink-0 pt-[15px] items-start justify-center z-10 cursor-pointer transition-colors';
const STAKE_CARD_REMOVE_ICON_BASE_CLASS = 'flex items-center justify-center transition-colors';
const STAKE_CARD_TITLE_BASE_CLASS = 'min-w-0 whitespace-normal break-words';
const STAKE_CARD_DETAIL_BASE_CLASS = 'min-w-0 whitespace-normal break-words';
const STAKE_CARD_ODDS_BASE_CLASS =
    'flex shrink-0 items-center justify-end gap-0.5 transition-colors text-filltext-ft-g';

const STAKE_CARD_SURFACE_STRATEGIES: Record<StakeCardSurfaceState, StakeCardStyleStrategy> = {
    invalid: {
        container: 'bg-filltext-ft-c',
        removeButton: 'bg-surface-muted hover:bg-brand-primary-1',
        removeIcon: 'text-func-lost',
        title: 'text-neutral-black-h',
        outcome: 'text-neutral-black-h',
        event: 'text-neutral-black-h',
        topInfo: 'opacity-40',
    },
    locked: {
        container: 'bg-surface-muted',
        removeButton: 'bg-surface-shell hover:bg-brand-primary-1',
        removeIcon: 'text-mini-sbd group-hover/remove-button:text-func-lost',
        title: 'text-filltext-ft-e',
        outcome: 'text-filltext-ft-e',
        event: 'text-filltext-ft-e',
        topInfo: '',
    },
    pending: {
        container: 'bg-surface-muted',
        removeButton: 'bg-surface-shell pointer-events-none',
        removeIcon: 'text-mini-sbd',
        title: 'text-filltext-ft-h',
        outcome: 'text-filltext-ft-h',
        event: 'text-filltext-ft-f',
        topInfo: '',
    },
    normal: {
        container: 'bg-[var(--slip-card-bg,var(--surface-selected))]',
        removeButton: 'bg-[var(--slip-card-remove-bg,var(--surface-shell))] hover:bg-brand-primary-1',
        removeIcon: 'text-mini-sbd group-hover/remove-button:text-func-lost',
        title: 'text-filltext-ft-h group-hover:text-[var(--slip-accent,var(--brand-primary-0))]',
        outcome: 'text-filltext-ft-h',
        event: 'text-filltext-ft-f',
        topInfo: '',
    },
};

const WARNING_STYLE_STRATEGY = {
    container: 'border border-func-lost',
    hoverShadow: 'shadow-[0px_2px_4px_0px_var(--func-lost)]',
    removeButton: 'bg-func-lost-solid text-func-lost',
    removeIcon: 'text-white',
} as const;

const resolveStakeCardSurfaceState = (
    isInvalid: boolean,
    isLocked: boolean,
    isPending: boolean,
): StakeCardSurfaceState => {
    if (isInvalid) return 'invalid';
    if (isPending) return 'pending';
    if (isLocked) return 'locked';
    return 'normal';
};

const createStakeCardViewModel = ({
    isInvalid,
    isLocked,
    isPending,
    hasWarning,
    hasWarningHover,
    oddsTrend,
}: {
    isInvalid: boolean;
    isLocked: boolean;
    isPending: boolean;
    hasWarning: boolean;
    hasWarningHover: boolean;
    oddsTrend: OddsTrend;
}): StakeCardViewModel => {
    const surfaceState = resolveStakeCardSurfaceState(isInvalid, isLocked, isPending);
    const surfaceStrategy = STAKE_CARD_SURFACE_STRATEGIES[surfaceState];
    const effectiveWarning = surfaceState !== 'invalid' && surfaceState !== 'pending' && hasWarning;
    const effectiveWarningHover = effectiveWarning && hasWarningHover;

    return {
        surfaceState,
        hasWarning: effectiveWarning,
        hasWarningHover: effectiveWarningHover,
        showLockedIcon: surfaceState === 'locked',
        showOdds: surfaceState !== 'locked',
        showChildren: true,
        containerClassName: cn(
            STAKE_CARD_CONTAINER_BASE_CLASS,
            surfaceStrategy.container,
            effectiveWarning && WARNING_STYLE_STRATEGY.container,
            effectiveWarningHover && WARNING_STYLE_STRATEGY.hoverShadow,
        ),
        removeButtonClassName: cn(
            STAKE_CARD_REMOVE_BUTTON_BASE_CLASS,
            effectiveWarningHover ? WARNING_STYLE_STRATEGY.removeButton : surfaceStrategy.removeButton,
        ),
        removeIconClassName: cn(
            STAKE_CARD_REMOVE_ICON_BASE_CLASS,
            effectiveWarningHover ? WARNING_STYLE_STRATEGY.removeIcon : surfaceStrategy.removeIcon,
        ),
        topInfoClassName: surfaceStrategy.topInfo,
        titleClassName: cn(STAKE_CARD_TITLE_BASE_CLASS, surfaceStrategy.title),
        outcomeClassName: cn(STAKE_CARD_DETAIL_BASE_CLASS, surfaceStrategy.outcome),
        eventClassName: cn(STAKE_CARD_DETAIL_BASE_CLASS, surfaceStrategy.event),
        oddsClassName: cn(
            STAKE_CARD_ODDS_BASE_CLASS,
            surfaceState === 'invalid' && 'text-neutral-black-h',
            surfaceState === 'pending' && 'text-filltext-ft-g',
            surfaceState === 'normal' && oddsTrend === null && 'text-[var(--slip-profit,var(--accent-warm))]',
            surfaceState === 'normal' && oddsTrend === 'up' && 'text-func-win',
            surfaceState === 'normal' && oddsTrend === 'down' && 'text-func-lost',
        ),
    };
};

const resolveStakeCardInfoRows = (
    order: 'market-selection-event' | 'event-selection-market' | 'ticket-market-selection',
    rows: Record<StakeCardInfoKey, string>,
): StakeCardInfoRow[] => {
    if (order === 'event-selection-market') {
        return [
            { key: 'event', text: rows.event },
            { key: 'outcome', text: rows.outcome },
            { key: 'market', text: rows.market },
        ];
    }

    return [
        { key: 'market', text: rows.market },
        { key: 'outcome', text: rows.outcome },
        { key: 'event', text: rows.event },
    ];
};

export interface StakeCardProps {
    children?: ReactNode;
    value: OddsEntity;
    /** Warning type — different business semantics reuse the same visual strategy */
    warningType?: StakeCardWarningType;
    /** Warning state hover highlight */
    warningHover?: boolean;
    /** Whether settlement is in progress */
    isPending?: boolean;
    /** 顶部信息栏右侧角标，可传入按钮节点支持点击交互 */
    topInfoBadge?: ReactNode;
    compact?: boolean;
    /** Custom class name */
    className?: string;
}

/**
 * Odds trend arrow component.
 * Note: Parent StakeCard manages the 5-second display logic; this component only renders.
 */
const OddsTrendArrow: FC<{ trend: OddsTrend }> = ({ trend }) => {
    if (!trend) return null;

    return trend === 'up' ? (
        <TrendUpSolid className="size-3 animate-trend-up" />
    ) : (
        <TrendDownSolid className="size-3 animate-trend-down" />
    );
};

export const StakeCard: FC<StakeCardProps> = memo(
    ({
        children,
        value,
        warningType,
        warningHover = false,
        isPending = false,
        topInfoBadge,
        compact = false,
        className,
    }) => {
        const { title, marketName, outcome } = value;
        const { odds } = outcome;
        const outcomeName = getOutcomeDisplayName(outcome);
        const oddsFormat = useOddsFormat();
        const isDesktop = useIsDesktop();
        const componentProfile = useThemeComponentProfile();
        const isOddsAnimationSuspended = useBetSlipStore((state) => state.isOddsAnimationSuspended);

        // Track odds change trend
        const prevOddsRef = useRef(odds);
        const [oddsTrend, setOddsTrend] = useState<OddsTrend>(null);

        // Watch for odds changes
        useEffect(() => {
            if (isOddsAnimationSuspended) {
                prevOddsRef.current = odds;
                setOddsTrend((current) => (current === null ? current : null));
                return;
            }

            if (odds === prevOddsRef.current) {
                return;
            }

            if (odds > prevOddsRef.current) {
                setOddsTrend('up');
            } else if (odds < prevOddsRef.current) {
                setOddsTrend('down');
            }
            prevOddsRef.current = odds;

            // Clear trend after 5 seconds
            const timer = setTimeout(() => setOddsTrend(null), 5000);
            return () => clearTimeout(timer);
        }, [isOddsAnimationSuspended, odds]);

        const removeSelection = useBetSlipStore.getState().remove;

        const onRemove = () => {
            if (isPending) return;
            removeSelection(value);
        };

        const { isLocked, isInvalid } = useOddsDisplay(value);
        const viewModel = useMemo(
            () =>
                createStakeCardViewModel({
                    isInvalid,
                    isLocked,
                    isPending,
                    hasWarning: !!warningType,
                    hasWarningHover: !!warningType && warningHover,
                    oddsTrend,
                }),
            [isInvalid, isLocked, isPending, oddsTrend, warningHover, warningType],
        );
        const infoRows = useMemo(
            () =>
                resolveStakeCardInfoRows(componentProfile.betSlip.selectionInfoOrder, {
                    market: marketName,
                    outcome: outcomeName,
                    event: title,
                }),
            [componentProfile.betSlip.selectionInfoOrder, marketName, outcomeName, title],
        );
        const [primaryInfoRow, secondaryInfoRow, tertiaryInfoRow] = infoRows;

        return (
            <div
                className={cn(viewModel.containerClassName, compact && isDesktop && 'text-[12px]', className)}
                style={{ width: isDesktop ? DRAWER_CARD_WIDTH : '100%' }}
                data-bet-slip-profile={componentProfile.betSlip.profile}
                data-slip-info-order={componentProfile.betSlip.selectionInfoOrder}
                data-energy-ball-selection-id={`${value.eventId}:${value.productId}:${value.marketId}:${value.specifiers}`}
            >
                {/* Left remove button area */}
                <button
                    type="button"
                    className={cn(viewModel.removeButtonClassName, compact && isDesktop && 'w-6 pt-3')}
                    onClick={onRemove}
                >
                    {isPending ? (
                        <TimePending className="size-4 animate-spin-slow text-filltext-ft-h" />
                    ) : (
                        <div className={viewModel.removeIconClassName}>
                            <CloseBold className="size-2.5" />
                        </div>
                    )}
                </button>
                {/* Main content */}
                <div
                    className={cn(
                        'z-10 flex min-w-0 flex-1 flex-col border-border-strong border-l px-2.5 py-3',
                        compact && isDesktop && 'px-2 py-2',
                    )}
                >
                    {/* Top info block: market -> outcome -> event, with odds pinned on the right */}
                    <div
                        className={cn(
                            'relative mb-2 flex items-start justify-between gap-2',
                            compact && isDesktop && 'mb-1.5',
                            viewModel.topInfoClassName,
                        )}
                    >
                        <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex min-w-0 items-start gap-1">
                                {/* Conflict icon: hidden when invalid/loading */}
                                {viewModel.hasWarning && <Warn className="mt-0.5 size-4 shrink-0 text-func-lost" />}

                                <span
                                    title={primaryInfoRow.text}
                                    className={cn(
                                        'flex-1 text-body-lg',
                                        compact && isDesktop && 'text-body-md',
                                        viewModel.titleClassName,
                                    )}
                                >
                                    {primaryInfoRow.text}
                                </span>
                            </div>
                            <span
                                title={secondaryInfoRow.text}
                                className={cn(
                                    'text-auxiliary-sm capitalize',
                                    compact && isDesktop && 'text-auxiliary-xs',
                                    viewModel.outcomeClassName,
                                )}
                                data-energy-ball-outcome={secondaryInfoRow.key === 'outcome' ? '' : undefined}
                            >
                                {secondaryInfoRow.text}
                            </span>

                            <span
                                title={tertiaryInfoRow.text}
                                className={cn(
                                    'mt-2 text-auxiliary-xs',
                                    compact && isDesktop && 'mt-1 line-clamp-1',
                                    viewModel.eventClassName,
                                )}
                                data-energy-ball-outcome={tertiaryInfoRow.key === 'outcome' ? '' : undefined}
                            >
                                {tertiaryInfoRow.text}
                            </span>
                        </div>
                        {/* Odds / lock icon / loading: when invalid, show odds only (no lock icon or trend) */}
                        {viewModel.showLockedIcon ? (
                            <OddsLock className="size-4 shrink-0 text-func-lost" />
                        ) : (
                            viewModel.showOdds &&
                            odds !== 0 && (
                                <div className={viewModel.oddsClassName}>
                                    {/* Hide trend arrow when invalid/loading */}
                                    {!isInvalid && !isPending && <OddsTrendArrow trend={oddsTrend} />}
                                    <AtOdds className="size-3" />

                                    <ConditionalTooltip
                                        content={getFullOddsByFormat(odds, oddsFormat)}
                                        side="top"
                                        forceShow={hasOddsExtraPrecision(odds)}
                                    >
                                        <span className={cn('text-body-lg', compact && isDesktop && 'text-body-md')}>
                                            {formatOddsByFormat(odds, oddsFormat)}
                                        </span>
                                    </ConditionalTooltip>
                                </div>
                            )
                        )}
                        {topInfoBadge && <div className="absolute top-[22px] right-1 z-10">{topInfoBadge}</div>}
                    </div>
                    {/* Invalid state hides children (input/quick buttons); loading state shows them but disabled */}
                    {viewModel.showChildren && children}
                </div>
            </div>
        );
    },
);

StakeCard.displayName = 'StakeCard';
