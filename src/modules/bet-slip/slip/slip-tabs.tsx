'use client';

import type { FC } from 'react';
import { cn } from '@/utils/common';
import { SelectionBadge } from './selection-badge';

/** Tab type */
export type SlipTabType = 'slip' | 'open' | 'settled';

export interface SlipTabsProps {
    /** Currently selected tab */
    value: SlipTabType;
    /** Tab change callback */
    onChange: (value: SlipTabType) => void;
    /** Bet slip selection count */
    selectionCount?: number;
    /** Custom class name */
    className?: string;
}

/** Betbus-style bet slip header without settings affordance. */
export const SlipTabs: FC<SlipTabsProps> = ({ value, onChange, selectionCount = 0, className }) => {
    const isSlipActive = value === 'slip';

    return (
        <div
            className={cn(
                'flex h-full items-center gap-2 bg-[var(--slip-header-bg,var(--surface-shell))] px-2',
                className,
            )}
        >
            <button
                type="button"
                onClick={() => onChange('slip')}
                className={cn(
                    'flex h-[34px] min-w-0 flex-1 cursor-pointer items-center justify-between rounded-sm px-3 text-left transition-colors',
                    isSlipActive
                        ? 'bg-[var(--slip-tab-active-bg,var(--brand-primary-0))] text-[var(--slip-tab-active-text,var(--on-brand))]'
                        : 'bg-[var(--slip-tab-idle-bg,var(--surface-selected))] text-[var(--slip-tab-idle-text,var(--filltext-ft-h))] hover:bg-[var(--slip-card-bg,var(--surface-2))]',
                )}
            >
                <span className="truncate text-body-md font-bold">Apuesta</span>
                {selectionCount > 0 && (
                    <span data-energy-ball-target="betslip-tab-slip-badge">
                        <SelectionBadge
                            className="h-5 min-w-5 rounded-full bg-[var(--slip-tab-active-text,var(--neutral-white-h))] px-1 text-auxiliary-xs font-bold text-[var(--slip-tab-active-bg,var(--brand-primary-0))]"
                            count={selectionCount}
                        />
                    </span>
                )}
            </button>

            <div className="flex h-[34px] shrink-0 items-center rounded-sm bg-[var(--slip-chip-bg,var(--surface-selected))] px-2 text-auxiliary-sm font-bold text-[var(--slip-chip-text,var(--accent-warm))]">
                Mejor cuota
            </div>
        </div>
    );
};
