'use client';

import type { FC, MouseEvent } from 'react';
import type { OutcomeModel } from '@/api/models/market';
import { LockFilled } from '@/components/icons';
import { ConditionalTooltip } from '@/components/tooltip';
import { TrendBubble } from '@/modules/match/_components/trend-bubble';
import { useOddsFormat } from '@/stores/slip-settings-store';
import { cn } from '@/utils/common';
import { formatOddsByFormat, getFullOddsByFormat, hasOddsExtraPrecision } from '@/utils/odds-format';

export interface BetBtnShortBaseProps {
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
}

/**
 * Short horizontal Bet Button used in match list cards.
 * Pure UI component used primarily in Hot Matches list
 */
export const BetBtnShortBase: FC<BetBtnShortBaseProps> = ({
    outcome,
    isLocked = false,
    selected = false,
    onClick,
    className,
}) => {
    const oddsFormat = useOddsFormat();
    const displayName = outcome.quick_name || outcome.name_alias || outcome.name;

    return (
        <button
            type="button"
            onClick={!isLocked ? onClick : undefined}
            disabled={isLocked}
            className={cn(
                'group/betBtn relative flex h-[var(--brand-odds-short-height,2rem)] min-w-0 flex-1 cursor-pointer items-center rounded-[var(--component-odds-radius,var(--brand-odds-radius,4px))] bg-border-strong p-px transition-colors hover:[background:var(--odds-idle-hover-border)]',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary-0',
                '[background:var(--brand-odds-border,var(--border-strong))] hover:[background:var(--brand-odds-hover-border,var(--odds-idle-hover-border))]',
                selected &&
                    '[background:var(--brand-odds-selected-bg,var(--odds-selected-bg))] hover:[background:var(--brand-odds-selected-hover-bg,var(--odds-selected-hover-bg))]',
                isLocked && 'cursor-not-allowed bg-filltext-ft-c hover:bg-filltext-ft-c',
                className,
            )}
        >
            <span
                className={cn(
                    'relative flex h-full min-w-0 flex-1 items-center justify-between gap-2 rounded-[var(--component-odds-radius,var(--brand-odds-radius,4px))] bg-[var(--brand-odds-bg,var(--surface-selected))] px-2.5 transition-colors group-hover/betBtn:[background:var(--brand-odds-hover-bg,var(--odds-idle-hover-bg))]',
                    'group-data-[odds-layout=stacked]/card:flex-col group-data-[odds-layout=stacked]/card:justify-center group-data-[odds-layout=stacked]/card:gap-0.5 group-data-[odds-layout=stacked]/card:px-1.5',
                    selected &&
                        '[background:var(--brand-odds-selected-bg,var(--odds-selected-bg))] group-hover/betBtn:[background:var(--brand-odds-selected-hover-bg,var(--odds-selected-hover-bg))]',
                    isLocked && 'bg-filltext-ft-a',
                )}
            >
                {isLocked ? (
                    <LockFilled className="mx-auto size-4 text-filltext-ft-e" />
                ) : (
                    <>
                        <ConditionalTooltip content={displayName} side="top" className="capitalize">
                            <span
                                className={cn(
                                    'block min-w-0 flex-1 truncate pr-1 text-left text-[var(--brand-odds-name,var(--filltext-ft-f))] text-auxiliary-sm capitalize transition-colors group-hover/betBtn:text-filltext-ft-h',
                                    'group-data-[odds-layout=stacked]/card:w-full group-data-[odds-layout=stacked]/card:flex-none group-data-[odds-layout=stacked]/card:pr-0 group-data-[odds-layout=stacked]/card:text-center group-data-[odds-layout=stacked]/card:text-auxiliary-2xs',
                                    selected && 'text-[var(--brand-odds-selected-text,var(--odds-selected-text))]',
                                )}
                            >
                                {displayName}
                            </span>
                        </ConditionalTooltip>

                        <ConditionalTooltip
                            content={outcome.odds ? getFullOddsByFormat(outcome.odds, oddsFormat) : '—'}
                            side="bottom"
                            forceShow={hasOddsExtraPrecision(outcome.odds)}
                        >
                            <span
                                className={cn(
                                    'shrink-0 text-center text-[var(--brand-odds-value,var(--accent-warm))] text-auxiliary-md font-bold tabular-nums transition-colors',
                                    'group-data-[odds-layout=stacked]/card:text-body-md',
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
};
