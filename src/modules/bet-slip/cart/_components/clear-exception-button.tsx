'use client';

import type { FC } from 'react';
import { cn } from '@/utils/common';

export interface ClearExceptionButtonProps {
    /** Button text */
    text: string;
    /** Click callback */
    onClick: () => void;
    /** Hover callback */
    onMouseEnter?: () => void;
    /** Hover leave callback */
    onMouseLeave?: () => void;
    /** Custom class name */
    className?: string;
}

/**
 * Clear exception button component.
 *
 * Displays exception state and clears exceptional selections.
 */
export const ClearExceptionButton: FC<ClearExceptionButtonProps> = ({
    text,
    onClick,
    onMouseEnter,
    onMouseLeave,
    className,
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            className={cn(
                'flex h-10 cursor-pointer items-center justify-center rounded-full transition-all',
                'min-w-[226px] w-[calc(100%-32px)] mx-auto',
                'bg-func-lost-solid',
                'text-body-md leading-4 text-neutral-white-h',
                className,
            )}
        >
            <span>{text}</span>
        </button>
    );
};
