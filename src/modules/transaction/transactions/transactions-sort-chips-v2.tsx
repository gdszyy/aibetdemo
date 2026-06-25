'use client';

import type { FC } from 'react';
import { cn } from '@/utils/common';

/** 交易页桌面端筛选胶囊选项。 */
interface TransactionsSortChipOption {
    label: string;
    value: string;
}

interface TransactionsSortChipsV2Props {
    options: TransactionsSortChipOption[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

/** 交易页桌面端 V2 胶囊筛选。 */
export const TransactionsSortChipsV2: FC<TransactionsSortChipsV2Props> = ({ options, value, onChange, className }) => {
    return (
        <div className={cn('hidden-scrollbar flex min-w-0 items-center gap-4 overflow-x-auto', className)}>
            {options.map((option) => {
                const isActive = option.value === value;

                return (
                    <button
                        key={option.value}
                        type="button"
                        onClick={() => onChange(option.value)}
                        className={cn(
                            'flex h-10 shrink-0 items-center justify-center rounded-sm px-4 text-body-md transition-colors',
                            isActive
                                ? 'bg-brand-primary-0 text-on-brand'
                                : 'bg-surface-1 text-filltext-ft-f hover:bg-filltext-ft-a hover:text-filltext-ft-h',
                        )}
                    >
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
};
