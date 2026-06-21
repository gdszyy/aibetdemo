'use client';

import { useAnimate } from 'motion/react';
import { memo, useEffect, useRef } from 'react';
import { cn } from '@/utils/common';

export interface SelectionBadgeProps {
    /** Selection count */
    count: number;
    /** Custom class name */
    className?: string;
}

/**
 * Bet slip count badge.
 *
 * Pure display component showing bet slip selection count.
 * - Shows '99+' when count exceeds 99
 * - Does not render when count <= 0
 * - Plays pulse scale animation on count change (without unmount/remount)
 */
export const SelectionBadge = memo<SelectionBadgeProps>(({ count, className }) => {
    const [scope, animate] = useAnimate();
    const prevCountRef = useRef(count);

    useEffect(() => {
        if (count !== prevCountRef.current && count > 0 && scope.current) {
            animate(scope.current, { scale: [1, 1.1, 1], opacity: [0.8, 1] }, { duration: 0.5, ease: 'easeInOut' });
        }
        prevCountRef.current = count;
    }, [count, animate, scope]);

    if (count <= 0) return null;

    return (
        <span
            ref={scope}
            className={cn(
                'flex min-w-4 items-center justify-center rounded-xs bg-brand-primary-0 px-0.5 text-center text-auxiliary-md text-neutral-white-h',
                className,
            )}
        >
            {count > 99 ? '99+' : count}
        </span>
    );
});

SelectionBadge.displayName = 'SelectionBadge';
