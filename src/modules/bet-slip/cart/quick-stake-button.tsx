'use client';

import type { FC } from 'react';
import { cn } from '@/utils/common';

export interface QuickStakeButtonProps {
    /** Quick amount */
    amount: number;
    /** Click callback */
    onClick?: () => void;
    /** Hover/focus start callback */
    onHoverStart?: () => void;
    /** Hover/focus end callback */
    onHoverEnd?: () => void;
    /** Whether disabled */
    disabled?: boolean;
    /** Match the Figma visual state */
    variant?: 'default' | 'active' | 'invalid';
    /** Disable pointer interaction without changing the visual style */
    interactiveDisabled?: boolean;
    /** Custom class name */
    className?: string;
}

/**
 * Quick stake amount button.
 *
 * Used to quickly add to the stake amount.
 */
export const QuickStakeButton: FC<QuickStakeButtonProps> = ({
    amount,
    onClick,
    onHoverStart,
    onHoverEnd,
    disabled = false,
    variant = 'default',
    interactiveDisabled = false,
    className,
}) => {
    const blocksInteraction = disabled || interactiveDisabled;

    return (
        <button
            type="button"
            onClick={() => {
                if (blocksInteraction) return;
                onClick?.();
            }}
            onMouseEnter={() => {
                if (blocksInteraction) return;
                onHoverStart?.();
            }}
            onMouseLeave={() => onHoverEnd?.()}
            onFocus={() => {
                if (blocksInteraction) return;
                onHoverStart?.();
            }}
            onBlur={() => onHoverEnd?.()}
            tabIndex={blocksInteraction ? -1 : undefined}
            className={cn(
                // Size
                'flex h-8 w-[46px] shrink-0 flex-col items-center justify-center px-1 py-2',
                'rounded-[var(--component-odds-radius,var(--style-radius-control))] transition-colors',
                'text-auxiliary-sm text-filltext-ft-g font-poppins',
                variant === 'default' &&
                    'bg-[var(--slip-quick-bg,var(--surface-muted))] text-filltext-ft-f hover:bg-[var(--slip-quick-hover-bg,var(--surface-selected))] hover:text-[var(--slip-quick-hover-text,var(--accent-warm))]',
                variant === 'active' &&
                    'bg-[var(--slip-quick-hover-bg,var(--brand-primary-1))] text-[var(--slip-quick-hover-text,var(--accent-warm))]',
                variant === 'invalid' && 'bg-neutral-black-a text-neutral-black-d',
                'cursor-pointer',
                'active:bg-brand-primary-0 active:text-on-brand',
                blocksInteraction && 'pointer-events-none',
                className,
            )}
        >
            +{amount}
        </button>
    );
};
