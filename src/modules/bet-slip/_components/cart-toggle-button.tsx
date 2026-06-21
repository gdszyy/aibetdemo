'use client';

import type { FC } from 'react';
import { ArrowDoubleRight } from '@/components/icons';
import { useUIStore } from '@/stores/ui-store';
import { cn } from '@/utils/common';
import { SelectionBadge } from '../slip/selection-badge';
import { useSelectionCount } from '../stores/bet-slip-store';

/**
 * BetSlip cart toggle button — belongs to bet-slip module.
 * Rendered in RightAside via children slot in Sports layout only.
 */
export const CartToggleButton: FC = () => {
    const betSlipDrawerOpen = useUIStore((s) => s.betSlipDrawerOpen);
    const toggleBetSlipDrawer = useUIStore((s) => s.toggleBetSlipDrawer);
    const selectionCount = useSelectionCount();

    return (
        <button
            type="button"
            onClick={toggleBetSlipDrawer}
            data-energy-ball-target="betslip-toggle"
            className={cn(
                'relative flex size-[39px] cursor-pointer items-center justify-center rounded-sm border border-[color:var(--brand-right-rail-button-border,var(--border-subtle))] bg-[var(--brand-right-rail-button-bg,var(--page-bg))] transition-all duration-300',
                betSlipDrawerOpen
                    ? 'border-[color:var(--brand-odds-hover-border,var(--brand-primary-0))] [background:var(--brand-odds-selected-bg,var(--odds-selected-bg))] text-[var(--brand-odds-selected-text,var(--odds-selected-text))]'
                    : 'text-filltext-ft-f hover:border-[color:var(--brand-odds-hover-border,var(--brand-primary-0))] hover:[background:var(--brand-odds-selected-bg,var(--odds-selected-bg))] hover:text-[var(--brand-odds-selected-text,var(--odds-selected-text))]',
            )}
        >
            <ArrowDoubleRight
                className={cn('size-3 transition-transform duration-300', betSlipDrawerOpen ? '' : 'rotate-180')}
            />
            {selectionCount > 0 && !betSlipDrawerOpen && (
                <span data-energy-ball-target="betslip-badge" className="absolute -top-1.5 -right-1">
                    <SelectionBadge
                        count={selectionCount}
                        className="rounded-full border border-page-bg bg-accent-warm text-surface-shell"
                    />
                </span>
            )}
        </button>
    );
};
