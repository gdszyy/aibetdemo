'use client';

import type { FC } from 'react';
import { Loading } from '@/components/loading/loading';
import { cn } from '@/utils/common';

export interface PlaceBetButtonProps {
    children: React.ReactNode;
    /** Whether disabled */
    disabled?: boolean;
    /** Whether in loading state */
    loading?: boolean;
    /** Click callback */
    onClick: () => void;
    /** Custom class name */
    className?: string;
}

/**
 * Place bet button component.
 *
 * Supports two states:
 * - Expanded: shows text only
 * - Collapsed (Single mode): shows text + amount info
 */
export const PlaceBetButton: FC<PlaceBetButtonProps> = ({
    children,
    disabled = false,
    loading = false,
    onClick,
    className,
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled || loading}
            className={cn(
                'flex h-10 cursor-pointer items-center rounded-[var(--component-slip-cta-radius,var(--style-radius-control))] transition-all',
                'min-w-[226px] w-[calc(100%-32px)] mx-auto',
                '[background:var(--slip-cta-bg,var(--odds-selected-bg))]',
                'text-body-md leading-4 font-bold text-[var(--slip-cta-text,var(--odds-selected-text))]',
                'hover:[background:var(--slip-cta-hover-bg,var(--odds-selected-hover-bg))]',
                'disabled:cursor-not-allowed disabled:bg-surface-3 disabled:text-filltext-ft-g disabled:opacity-100',
                'justify-center',
                loading && 'pointer-events-none opacity-50',
                className,
            )}
        >
            {loading ? (
                <div className="flex w-full items-center justify-center">
                    <Loading className="size-5" variant="color-white" />
                </div>
            ) : typeof children === 'string' ? (
                <span key="string_button">{children}</span>
            ) : (
                children
            )}
        </button>
    );
};
