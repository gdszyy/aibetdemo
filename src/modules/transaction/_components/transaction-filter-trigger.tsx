'use client';

import type { FC, ReactNode } from 'react';
import { ArrowDown } from '@/components/icons';
import { cn } from '@/utils/common';

interface TransactionFilterTriggerProps {
    label: ReactNode;
    className?: string;
    onClick: () => void;
    active?: boolean;
}

/**
 * 交易中心移动端筛选触发器。
 */
export const TransactionFilterTrigger: FC<TransactionFilterTriggerProps> = ({
    label,
    className,
    onClick,
    active = false,
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                'flex h-10 min-w-0 items-center justify-between gap-2 rounded-full border border-transparent bg-surface-1 px-4 text-auxiliary-md text-filltext-ft-g transition-colors',
                active && 'border-filltext-ft-g text-filltext-ft-h',
                className,
            )}
        >
            <span className="min-w-0 truncate text-left">{label}</span>
            <ArrowDown
                className={cn(
                    'size-3 shrink-0 text-filltext-ft-e transition-transform',
                    active && 'rotate-180 text-filltext-ft-g',
                )}
            />
        </button>
    );
};
