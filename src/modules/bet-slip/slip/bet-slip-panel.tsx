'use client';

import type { FC } from 'react';
import { cn } from '@/utils/common';
import { BetSlipDrawer } from './bet-slip-drawer';

export interface BetSlipPanelProps {
    /** Custom class name */
    className?: string;
}

/** Betbus-style fixed bet slip panel. */
export const BetSlipPanel: FC<BetSlipPanelProps> = ({ className }) => {
    return (
        <div
            className={cn('relative flex shrink-0 flex-col', className)}
            data-testid="bet-slip-panel"
            data-energy-ball-target="betslip-panel"
        >
            <BetSlipDrawer className="mt-2 min-h-0 flex-1" />
        </div>
    );
};
