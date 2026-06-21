'use client';

import { type FC, type MouseEvent, useEffect, useRef, useState } from 'react';
import type { OutcomeModel } from '@/api/models/market';
import { LockFilled } from '@/components/icons';
import { ConditionalTooltip } from '@/components/tooltip';
import { TrendBubble } from '@/modules/match/_components/trend-bubble';
import { useOddsFormat } from '@/stores/slip-settings-store';
import { cn } from '@/utils/common';
import { formatOddsByFormat, getFullOddsByFormat, hasOddsExtraPrecision } from '@/utils/odds-format';

interface BetBtnTestDataAttributes {
    /** 测试定位用赛事 ID。 */
    'data-event-id': string;
    /** 测试定位用市场 ID。 */
    'data-market-id': string;
    /** 测试定位用投注项 ID。 */
    'data-outcome-id': string;
    /** 测试定位用盘口 specifiers。 */
    'data-specifiers': string;
    /** 测试定位用投注项原始名称。 */
    'data-outcome-name': string;
    /** 测试定位用投注项最新更新时间。 */
    'data-last-update': string;
}

export interface BetBtnStandardBaseProps {
    /** Outcome data from API */
    outcome: OutcomeModel;
    /** Whether the button is locked (active=2, suspended, or WS dead) */
    isLocked?: boolean;
    /** Whether the button is selected in cart */
    selected?: boolean;
    /** Click handler */
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
    /** Custom className for responsive width */
    className?: string;
    /** Height variant by page context */
    size?: 'default' | 'tall';
    /** When true, prefer quick_name / name_alias over name for compact odds labels */
    useNameAlias?: boolean;
    /** Layout mode for the button interior */
    layout?: 'horizontal' | 'vertical' | 'auto';
    /** Whether to show the outcome name inside the button */
    showName?: boolean;
    /** 仅用于按钮展示的名称，不改变下注数据。 */
    displayNameOverride?: string;
    /** Visual treatment by surface */
    surface?: 'default' | 'detail';
    /** 详情页测试定位属性，仅透传到真实按钮节点。 */
    testDataAttributes?: BetBtnTestDataAttributes;
}

/**
 * Auto-detect whether a name span overflows; only active for `auto` layout.
 */
function useNameOverflow(enabled: boolean) {
    const ref = useRef<HTMLSpanElement>(null);
    const [overflowing, setOverflowing] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el || !enabled) return;
        const update = () => setOverflowing(el.scrollWidth > el.clientWidth);
        update();
        const ro = new ResizeObserver(update);
        ro.observe(el);
        return () => ro.disconnect();
    }, [enabled]);

    return [ref, overflowing] as const;
}

/**
 * Standard Bet Button — supports horizontal, vertical, and auto-overflow layout.
 */
export const BetBtnStandardBase: FC<BetBtnStandardBaseProps> = ({
    outcome,
    isLocked = false,
    selected = false,
    onClick,
    className,
    size = 'default',
    useNameAlias = true,
    layout = 'horizontal',
    showName = true,
    displayNameOverride,
    surface = 'default',
    testDataAttributes,
}) => {
    const oddsFormat = useOddsFormat();
    const displayName =
        displayNameOverride ?? (useNameAlias ? outcome.quick_name || outcome.name_alias || outcome.name : outcome.name);
    const [nameRef, isOverflowing] = useNameOverflow(layout === 'auto' && showName);

    const isVertical = layout === 'vertical' || (layout === 'auto' && showName && isOverflowing);
    const oddsOnly = !showName && !isVertical;
    const textColor = selected
        ? 'text-[var(--brand-odds-selected-text,var(--odds-selected-text))]'
        : 'text-[var(--brand-odds-name,var(--filltext-ft-g))] group-hover/betBtn:text-[var(--brand-odds-value,var(--brand-red))]';

    const layoutClass = isVertical
        ? 'flex-col items-center justify-center gap-0.5'
        : oddsOnly
          ? 'flex-row items-center justify-center md:min-w-[96px]'
          : 'flex-row items-center justify-between md:min-w-[140px]';

    if (surface === 'detail') {
        return (
            <button
                type="button"
                onClick={!isLocked ? onClick : undefined}
                disabled={isLocked}
                {...testDataAttributes}
                className={cn(
                    'group/betBtn relative flex min-h-[44px] min-w-0 flex-1 cursor-pointer items-center rounded bg-[var(--brand-odds-border,var(--border-strong))] p-px transition-colors hover:[background:var(--brand-odds-hover-border,var(--odds-idle-hover-border))]',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary-0',
                    selected &&
                        '[background:var(--brand-odds-selected-bg,var(--odds-selected-bg))] hover:[background:var(--brand-odds-selected-hover-bg,var(--odds-selected-hover-bg))]',
                    isLocked && 'cursor-not-allowed bg-filltext-ft-c hover:bg-filltext-ft-c',
                    className,
                )}
            >
                <span
                    className={cn(
                        'relative flex min-h-[42px] min-w-0 flex-1 items-center justify-between gap-2 rounded bg-[var(--brand-odds-bg,var(--surface-selected))] px-2 transition-colors group-hover/betBtn:[background:var(--brand-odds-hover-bg,var(--odds-idle-hover-bg))]',
                        !showName && 'justify-center',
                        selected &&
                            '[background:var(--brand-odds-selected-bg,var(--odds-selected-bg))] group-hover/betBtn:[background:var(--brand-odds-selected-hover-bg,var(--odds-selected-hover-bg))]',
                        isLocked && 'bg-filltext-ft-a',
                    )}
                >
                    {isLocked ? (
                        <LockFilled className="mx-auto size-4 text-filltext-ft-e" />
                    ) : (
                        <>
                            {showName && (
                                <ConditionalTooltip content={displayName} side="top" className="capitalize">
                                    <span
                                        className={cn(
                                            'block min-w-0 flex-1 truncate pr-1 text-left text-[var(--brand-odds-name,var(--filltext-ft-f))] text-auxiliary-sm capitalize transition-colors group-hover/betBtn:text-filltext-ft-h',
                                            selected &&
                                                'text-[var(--brand-odds-selected-text,var(--odds-selected-text))]',
                                        )}
                                    >
                                        {displayName}
                                    </span>
                                </ConditionalTooltip>
                            )}

                            <ConditionalTooltip
                                content={outcome.odds ? getFullOddsByFormat(outcome.odds, oddsFormat) : '—'}
                                side="bottom"
                                forceShow={hasOddsExtraPrecision(outcome.odds)}
                            >
                                <span
                                    className={cn(
                                        'shrink-0 text-center text-[var(--brand-odds-value,var(--accent-warm))] text-body-md font-bold tabular-nums transition-colors',
                                        selected && 'text-[var(--brand-odds-selected-text,var(--odds-selected-text))]',
                                    )}
                                >
                                    {outcome.odds ? formatOddsByFormat(outcome.odds, oddsFormat) : '—'}
                                </span>
                            </ConditionalTooltip>
                        </>
                    )}
                    {!isLocked && <TrendBubble value={outcome.odds} selected={selected} />}
                </span>
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={!isLocked ? onClick : undefined}
            disabled={isLocked}
            className={cn(
                'group/betBtn relative flex min-w-0 flex-1 cursor-pointer rounded-sm border border-[color:var(--brand-odds-border,transparent)] px-3 transition-all hover:border-[color:var(--brand-odds-hover-border,var(--brand-primary-0))] hover:[background:var(--brand-odds-hover-bg,var(--surface-2))]',
                'max-md:flex-col max-md:items-center max-md:justify-center max-md:gap-0.5 max-md:h-14',
                layoutClass,
                isVertical || size === 'tall' ? 'h-14' : 'h-10',
                selected
                    ? '[background:var(--brand-odds-selected-bg,var(--odds-selected-bg))] hover:[background:var(--brand-odds-selected-hover-bg,var(--odds-selected-hover-bg))]'
                    : 'bg-[var(--brand-odds-bg,var(--surface-1))]',
                isLocked && 'cursor-not-allowed bg-filltext-ft-b!',
                className,
            )}
        >
            {isLocked ? (
                <div className="flex w-full items-center justify-center">
                    <LockFilled className="size-4 text-filltext-ft-e" />
                </div>
            ) : (
                <>
                    {showName && (
                        <ConditionalTooltip content={displayName} side="top" className="capitalize">
                            <span
                                ref={layout === 'auto' ? nameRef : undefined}
                                className={cn(
                                    'capitalize transition-colors text-auxiliary-sm truncate',
                                    'max-md:w-full max-md:text-center',
                                    isVertical
                                        ? 'w-full text-center'
                                        : 'flex-1 min-w-0 mr-2 whitespace-nowrap text-left',
                                    textColor,
                                )}
                            >
                                {displayName}
                            </span>
                        </ConditionalTooltip>
                    )}

                    <ConditionalTooltip
                        content={outcome.odds ? getFullOddsByFormat(outcome.odds, oddsFormat) : '—'}
                        side="top"
                        forceShow={hasOddsExtraPrecision(outcome.odds)}
                    >
                        <span
                            className={cn(
                                'shrink-0 text-market transition-colors tabular-nums',
                                oddsOnly && 'text-center',
                                selected ? textColor : 'text-[var(--brand-odds-value,var(--accent-warm))]',
                            )}
                        >
                            {outcome.odds ? formatOddsByFormat(outcome.odds, oddsFormat) : '—'}
                        </span>
                    </ConditionalTooltip>

                    <TrendBubble value={outcome.odds} selected={selected} variant="standard" />
                </>
            )}
        </button>
    );
};
