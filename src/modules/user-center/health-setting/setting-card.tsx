'use client';

import type { FC } from 'react';
import { cn } from '@/utils/common';

interface SettingCardProps {
    /** Title */
    title: string;
    /** Display value */
    value: string;
    /** Whether a value has been set */
    hasValue?: boolean;
    /** Whether currently expanded (active) */
    isExpanded?: boolean;
    /** Pending hint text (optional) */
    pendingText?: string;
    /** Click callback */
    onClick: () => void;
}

/**
 * Health setting card component
 *
 * Three-state styling:
 * - Default (not set): muted content token
 * - Set: secondary content token
 * - Active (expanded): brand token with active border
 */
export const SettingCard: FC<SettingCardProps> = ({ title, value, hasValue, isExpanded, pendingText, onClick }) => {
    // Three-state color logic
    const textColor = isExpanded
        ? 'text-brand-red' // Active state: red
        : cn('group-hover:text-filltext-ft-g', hasValue ? 'text-filltext-ft-g' : 'text-filltext-ft-e'); // Default/Hover/Set

    return (
        <div className="flex flex-col gap-1">
            <div
                onClick={onClick}
                className={cn(
                    'group flex self-stretch items-center justify-between px-4 h-10 rounded-sm cursor-pointer',
                    'bg-filltext-ft-a border-[0.5px] border-filltext-ft-d',
                    'transition-colors',
                )}
            >
                <span className={cn('text-body-md transition-colors', textColor)}>{title}</span>
                <span className={cn('text-body-md transition-colors', textColor)}>{value}</span>
            </div>
            {/* Pending hint */}
            {pendingText && <div className="text-right text-auxiliary-sm text-func-pending pr-1">{pendingText}</div>}
        </div>
    );
};
