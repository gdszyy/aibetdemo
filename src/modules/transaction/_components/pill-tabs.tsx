'use client';

import type { ReactNode } from 'react';
import { cn } from '@/utils/common';

export interface PillTabItem<T extends string = string> {
    value: T;
    label: ReactNode;
}

interface PillTabsProps<T extends string = string> {
    items: PillTabItem<T>[];
    value: T;
    onChange: (value: T) => void;
    className?: string;
}

/** Segmented pill-style tab control */
export function PillTabs<T extends string>({ items, value, onChange, className }: PillTabsProps<T>) {
    return (
        <div className={cn('flex shrink-0 gap-2 bg-filltext-ft-b rounded-md p-2 overflow-x-auto', className)}>
            {items.map((item) => {
                const isActive = item.value === value;
                return (
                    <button
                        key={item.value}
                        type="button"
                        onClick={() => onChange(item.value)}
                        className={cn(
                            'flex-1 shrink-0 min-w-fit flex items-center justify-center px-3 py-2 rounded-sm text-body-md transition-colors cursor-pointer whitespace-nowrap',
                            isActive
                                ? 'bg-surface-1 text-brand-primary-0'
                                : 'text-filltext-ft-g hover:bg-surface-1 hover:text-filltext-ft-h',
                        )}
                    >
                        {item.label}
                    </button>
                );
            })}
        </div>
    );
}
