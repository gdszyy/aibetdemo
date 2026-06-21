'use client';

import type { FC } from 'react';
import { cn } from '@/utils/common';

interface SortChipOption {
    label: string;
    value: string;
}

interface SortChipsProps {
    options: SortChipOption[];
    value: string;
    onChange: (value: string) => void;
}

export const SortChips: FC<SortChipsProps> = ({ options, value, onChange }) => {
    return (
        <div className="flex gap-4 items-center overflow-x-auto min-w-0">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange(opt.value)}
                    className={cn(
                        'h-8 md:h-10 px-3 md:px-4 rounded-sm text-body-md whitespace-nowrap cursor-pointer transition-colors',
                        opt.value === value
                            ? 'bg-surface-1 border border-brand-primary-0 text-brand-primary-0'
                            : 'bg-filltext-ft-a text-filltext-ft-f hover:text-filltext-ft-g',
                    )}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    );
};
