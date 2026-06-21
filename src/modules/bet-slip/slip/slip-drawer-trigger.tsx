'use client';

import type { CSSProperties, FC } from 'react';
import { ArrowDoubleLeft, ArrowDoubleRight } from '@/components/icons';
import { cn } from '@/utils/common';
import { SelectionBadge } from './selection-badge';

export interface SlipDrawerTriggerProps {
    /** Whether expanded */
    isOpen: boolean;
    /** Click callback */
    onClick: () => void;
    /** Badge number (bet slip count) */
    count?: number;
    /** Whether to show badge (default true) */
    showBadge?: boolean;
    /** Custom class name */
    className?: string;
    /** Custom style */
    style?: CSSProperties;
}

/**
 * Bet slip drawer trigger button.
 *
 * Fixed position, click to expand/collapse drawer.
 * Shows bet slip count badge at top-right corner.
 */
export const SlipDrawerTrigger: FC<SlipDrawerTriggerProps> = ({
    isOpen,
    onClick,
    count = 0,
    showBadge = true,
    className,
    style,
}) => {
    // Badge needs space — outer container provides padding
    return (
        <div className={cn('pr-1.5', className)} style={style}>
            <button
                type="button"
                onClick={onClick}
                className={cn(
                    'relative flex size-9 cursor-pointer items-center justify-center',
                    'rounded-sm border border-surface-3 bg-surface-1/60 backdrop-blur-sm',
                    'text-mini-sbd transition-all duration-200',
                    'hover:bg-surface-2 hover:border-brand-red hover:text-brand-red',
                )}
            >
                {/* When expanded show right arrow (click to collapse), when collapsed show left arrow (click to expand) */}
                {isOpen ? <ArrowDoubleRight className="size-3" /> : <ArrowDoubleLeft className="size-3" />}

                {/* Top-right badge — shows bet slip count */}
                {showBadge && <SelectionBadge count={count} className="absolute -right-1.5 -top-1.5" />}
            </button>
        </div>
    );
};
